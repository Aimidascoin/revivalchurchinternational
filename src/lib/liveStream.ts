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
 * Reads live status from the YouTube Data API v3.
 * Returns a degraded result instead of throwing so the page always renders.
 */
export const fetchLiveStatus = async (): Promise<LiveStatus> => {
  const fallback: LiveStatus = {
    isLive: hasLiveVideo,
    viewers: null,
    title: null,
    startedAt: null,
    degraded: true,
  };

  if (!hasLiveVideo || !envKey) return fallback;

  try {
    const url = new URL('https://www.googleapis.com/youtube/v3/videos');
    url.searchParams.set('part', 'snippet,stream,liveStreamingDetails');
    url.searchParams.set('id', liveStream.youtubeId);
    url.searchParams.set('key', envKey);

    const response = await fetch(url.toString());
    if (!response.ok) return fallback;

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
  } catch {
    return fallback;
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

/** Polls YouTube for live status and refreshes the countdown every minute. */
export const useLiveStatus = (): LiveStatus & { loading: boolean } => {
  const [status, setStatus] = useState<LiveStatus>({
    isLive: hasLiveVideo,
    viewers: null,
    title: null,
    startedAt: null,
    degraded: true,
  });
  const [loading, setLoading] = useState(true);
  const [, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const result = await fetchLiveStatus();
      if (!cancelled) {
        setStatus(result);
        setLoading(false);
      }
    };

    void load();
    const poll = window.setInterval(load, POLL_MS);
    const ticker = window.setInterval(() => setTick((value) => value + 1), 30_000);

    return () => {
      cancelled = true;
      window.clearInterval(poll);
      window.clearInterval(ticker);
    };
  }, []);

  return { ...status, loading };
};
