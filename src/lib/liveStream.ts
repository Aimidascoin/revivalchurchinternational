import { useEffect, useState } from 'react';
import { LIVE_STREAM } from '../data/churchData';

export interface LiveStreamConfig {
  youtubeId: string;
  rtmpIngestUrl: string;
  streamKeyEnv: string;
  schedule: string;
  channelUrl: string;
}

export interface LiveStatus {
  /** True when a broadcast for the configured video id is currently live. */
  isLive: boolean;
  /** Concurrent viewers reported by YouTube, or null when unavailable. */
  viewers: number | null;
  title: string | null;
  /** ISO timestamp the broadcast actually started, or null. */
  startedAt: string | null;
  /** True when a status could not be read (no API key, blocked, quota). */
  degraded: boolean;
}

const envId = (import.meta.env.VITE_YOUTUBE_LIVE_ID as string | undefined)?.trim();
const envKey = (import.meta.env.VITE_YOUTUBE_API_KEY as string | undefined)?.trim();

/** Runtime stream config: repo variables win over the committed defaults. */
export const liveStream: LiveStreamConfig = {
  ...LIVE_STREAM,
  youtubeId: envId && envId.length > 0 ? envId : LIVE_STREAM.youtubeId,
};

export const hasLiveVideo = liveStream.youtubeId.length > 0;

/** Canonical watch URL for the configured broadcast (or the channel when unset). */
export const watchUrl = hasLiveVideo
  ? `https://www.youtube.com/watch?v=${liveStream.youtubeId}`
  : liveStream.channelUrl;

export const embedUrl = (options: { autoplay?: boolean; muted?: boolean } = {}) => {
  if (!hasLiveVideo) return null;
  const params = new URLSearchParams({
    rel: '0',
    modestbranding: '1',
    playsinline: '1',
  });
  if (options.autoplay) params.set('autoplay', '1');
  if (options.muted) params.set('mute', '1');
  return `https://www.youtube-nocookie.com/embed/${liveStream.youtubeId}?${params.toString()}`;
};

/**
 * Reads live status from the YouTube Data API v3 when an API key is configured,
 * otherwise falls back to YouTube's public InnerTube endpoint (no key required).
 * Returns a degraded result instead of throwing so the page always renders.
 */
export const fetchLiveStatus = async (): Promise<LiveStatus> => {
  // Degraded assumption: a configured broadcast id is treated as live so the
  // real player (which renders YouTube's own offline state) is never hidden.
  const fallback: LiveStatus = {
    isLive: hasLiveVideo,
    viewers: null,
    title: null,
    startedAt: null,
    degraded: true,
  };

  if (!hasLiveVideo) return { ...fallback, isLive: false };

  if (envKey) {
    try {
      const url = new URL('https://www.googleapis.com/youtube/v3/videos');
      url.searchParams.set('part', 'snippet,stream,liveStreamingDetails');
      url.searchParams.set('id', liveStream.youtubeId);
      url.searchParams.set('key', envKey);

      const response = await fetch(url.toString());
      if (response.ok) {
        const payload = (await response.json()) as {
          items?: Array<{
            snippet?: { title?: string; liveBroadcastContent?: string };
            liveStreamingDetails?: {
              actualStartTime?: string;
              concurrentViewers?: string;
            };
          }>;
        };

        const item = payload.items?.[0];
        if (!item) return { ...fallback, isLive: false };

        const content = item.snippet?.liveBroadcastContent;
        const startedAt = item.liveStreamingDetails?.actualStartTime ?? null;
        const isLive = content === 'live' || (startedAt !== null && content !== 'upcoming');
        const viewers = Number(item.liveStreamingDetails?.concurrentViewers ?? Number.NaN);

        return {
          isLive,
          viewers: Number.isFinite(viewers) ? viewers : null,
          title: item.snippet?.title ?? null,
          startedAt,
          degraded: false,
        };
      }
    } catch {
      /* fall through to the keyless probe */
    }
  }

  const keyless = await fetchInnerTubeStatus(liveStream.youtubeId);
  return keyless ?? fallback;
};

interface InnerTubeResponse {
  playabilityStatus?: { status?: string };
  videoDetails?: { title?: string; isLive?: boolean };
  microformat?: {
    playerMicroformatRenderer?: {
      liveBroadcastDetails?: {
        startTimestamp?: string;
        concurrentViewers?: string;
        isLiveNow?: boolean;
      };
    };
  };
}

/**
 * Keyless live detection via YouTube's own web player endpoint (the same one
 * youtube.com uses). Works when no Google Cloud API key is configured.
 * Returns null when blocked (CORS/network) so callers can degrade gracefully.
 */
const fetchInnerTubeStatus = async (videoId: string): Promise<LiveStatus | null> => {
  try {
    const response = await fetch(
      'https://www.youtube.com/youtubei/v1/player?prettyPrint=false',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          context: { client: { clientName: 'WEB', clientVersion: '2.20250101.01.00' } },
          videoId,
        }),
      },
    );
    if (!response.ok) return null;

    const payload = (await response.json()) as InnerTubeResponse;
    if (!payload.playabilityStatus?.status) return null;

    const details = payload.microformat?.playerMicroformatRenderer?.liveBroadcastDetails;
    const isLive =
      payload.videoDetails?.isLive === true || details?.isLiveNow === true;
    const viewers = Number(details?.concurrentViewers ?? Number.NaN);

    return {
      isLive,
      viewers: Number.isFinite(viewers) ? viewers : null,
      title: payload.videoDetails?.title ?? null,
      startedAt: details?.startTimestamp ?? null,
      degraded: false,
    };
  } catch {
    return null;
  }
};

/** Local-time helper used for the "service starts in" countdown. */
export const formatCountdown = (target: Date, now: Date = new Date()): string => {
  const delta = Math.max(0, target.getTime() - now.getTime());
  const days = Math.floor(delta / 86_400_000);
  const hours = Math.floor((delta % 86_400_000) / 3_600_000);
  const minutes = Math.floor((delta % 3_600_000) / 60_000);
  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};

/** Next upcoming Sunday 09:30 or Wednesday 19:00 local time. */
export const nextServiceDate = (now: Date = new Date()): Date => {
  const candidates: Date[] = [];
  for (let offset = 0; offset < 8; offset += 1) {
    const day = new Date(now);
    day.setDate(now.getDate() + offset);
    day.setSeconds(0, 0);
    if (day.getDay() === 0) {
      day.setHours(9, 30, 0, 0);
      if (day.getTime() > now.getTime()) candidates.push(new Date(day));
      day.setHours(19, 0, 0, 0);
      if (day.getTime() > now.getTime()) candidates.push(new Date(day));
    }
    if (day.getDay() === 3) {
      day.setHours(19, 0, 0, 0);
      if (day.getTime() > now.getTime()) candidates.push(new Date(day));
    }
  }
  candidates.sort((a, b) => a.getTime() - b.getTime());
  return candidates[0] ?? now;
};

const POLL_MS = 45_000;

export interface LiveSnapshot extends LiveStatus {
  loading: boolean;
}

// Shared store: every indicator subscribes to one polling loop instead of
// firing its own YouTube request.
let snapshot: LiveSnapshot = {
  isLive: hasLiveVideo,
  viewers: null,
  title: null,
  startedAt: null,
  degraded: true,
  loading: true,
};
const listeners = new Set<(next: LiveSnapshot) => void>();
let pollTimer: number | null = null;
let tickTimer: number | null = null;

const publish = () => {
  const current = snapshot;
  listeners.forEach((listener) => listener(current));
};

const refresh = async () => {
  const result = await fetchLiveStatus();
  snapshot = { ...result, loading: false };
  publish();
};

const startSharedPolling = () => {
  if (pollTimer !== null) return;
  void refresh();
  pollTimer = window.setInterval(() => void refresh(), POLL_MS);
  // Re-render every 30s so countdowns keep ticking without new data.
  tickTimer = window.setInterval(() => {
    snapshot = { ...snapshot };
    publish();
  }, 30_000);
};

const stopSharedPolling = () => {
  if (listeners.size > 0) return;
  if (pollTimer !== null) window.clearInterval(pollTimer);
  if (tickTimer !== null) window.clearInterval(tickTimer);
  pollTimer = null;
  tickTimer = null;
};

/** Subscribes to the shared live status (YouTube live, viewers, countdown). */
export const useLiveStatus = (): LiveSnapshot => {
  const [value, setValue] = useState<LiveSnapshot>(snapshot);

  useEffect(() => {
    const listener = (next: LiveSnapshot) => setValue(next);
    listeners.add(listener);
    if (listeners.size === 1) startSharedPolling();
    else setValue(snapshot);

    return () => {
      listeners.delete(listener);
      stopSharedPolling();
    };
  }, []);

  return value;
};
