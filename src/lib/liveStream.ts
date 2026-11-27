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
const apiUrl = (import.meta.env.VITE_API_URL as string | undefined)?.trim()?.replace(/\/$/, '');

/** Resolved at runtime: env var, then backend discovery, then committed default. */
let resolvedVideoId = envId && envId.length > 0 ? envId : LIVE_STREAM.youtubeId;

/** Runtime stream config: repo variables win over the committed defaults. */
export const liveStream: LiveStreamConfig = {
  ...LIVE_STREAM,
  youtubeId: resolvedVideoId,
};

export const hasLiveVideo = resolvedVideoId.length > 0;

/** Canonical watch URL for the configured broadcast (or the channel when unset). */
export const watchUrl = resolvedVideoId
  ? `https://www.youtube.com/watch?v=${resolvedVideoId}`
  : LIVE_STREAM.channelUrl;

export const embedUrl = (options: { autoplay?: boolean; muted?: boolean } = {}) => {
  if (!resolvedVideoId) return null;
  const params = new URLSearchParams({
    rel: '0',
    modestbranding: '1',
    playsinline: '1',
  });
  if (options.autoplay) params.set('autoplay', '1');
  if (options.muted) params.set('mute', '1');
  return `https://www.youtube-nocookie.com/embed/${resolvedVideoId}?${params.toString()}`;
};

/**
 * Reads live status from the YouTube Data API v3 when an API key is configured,
 * otherwise falls back to YouTube's public InnerTube endpoint (no key required).
 * Returns a degraded result instead of throwing so the page always renders.
 */
export const fetchLiveStatus = async (): Promise<LiveStatus> => {
  // Prefer backend discovery so a newly started broadcast is picked up without
  // having to redeploy a new VITE_YOUTUBE_LIVE_ID.
  if (apiUrl) {
    try {
      const response = await fetch(`${apiUrl}/youtube/live`, {
        headers: { Accept: 'application/json' },
      });
      if (response.ok) {
        const payload = (await response.json()) as {
          ok?: boolean;
          data?: {
            videoId?: string;
            isLive?: boolean;
            title?: string | null;
            viewers?: number | null;
            degraded?: boolean;
          };
        };
        const data = payload?.data;
        if (data?.videoId) {
          resolvedVideoId = data.videoId;
          return {
            isLive: data.isLive === true,
            viewers: typeof data.viewers === 'number' ? data.viewers : null,
            title: typeof data.title === 'string' ? data.title : null,
            startedAt: null,
            degraded: data.degraded === true,
          };
        }
      }
    } catch {
      /* fall through to the legacy probe */
    }
  }

  // Degraded assumption: a configured broadcast id is treated as live so the
  // real player (which renders YouTube's own offline state) is never hidden.
  const fallback: LiveStatus = {
    isLive: resolvedVideoId.length > 0,
    viewers: null,
    title: null,
    startedAt: null,
    degraded: true,
  };

  if (!resolvedVideoId) return { ...fallback, isLive: false };

  if (envKey) {
    try {
      const url = new URL('https://www.googleapis.com/youtube/v3/videos');
      url.searchParams.set('part', 'snippet,stream,liveStreamingDetails');
      url.searchParams.set('id', resolvedVideoId);
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

  // Browser-safe probe via the official IFrame API (no CORS problems).
  const iframe = await fetchIframeStatus(resolvedVideoId);
  if (iframe) return iframe;

  const keyless = await fetchInnerTubeStatus(resolvedVideoId);
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

/**
 * Browser-safe live detection. YouTube's youtubei/v1/player endpoint has no
 * CORS headers, so a direct fetch always fails in the browser. The official
 * IFrame API talks to the player over postMessage and exposes the same
 * `isLive` flag via getVideoData(), so we probe with a tiny hidden player.
 */
type YTPlayerLike = {
  getVideoData?: () => Record<string, unknown>;
  destroy?: () => void;
};
type YTNamespace = {
  Player: new (target: HTMLElement, options: Record<string, unknown>) => YTPlayerLike;
};
type WindowWithYT = Window & {
  YT?: YTNamespace;
  onYouTubeIframeAPIReady?: () => void;
};

let ytApiPromise: Promise<YTNamespace> | null = null;

const loadYouTubeIframeApi = (): Promise<YTNamespace> => {
  const w = window as WindowWithYT;
  if (w.YT?.Player) return Promise.resolve(w.YT);
  if (!ytApiPromise) {
    ytApiPromise = new Promise<YTNamespace>((resolve, reject) => {
      const previous = w.onYouTubeIframeAPIReady;
      w.onYouTubeIframeAPIReady = () => {
        previous?.();
        if (w.YT?.Player) resolve(w.YT);
        else reject(new Error('YouTube IFrame API unavailable'));
      };
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;
      script.onerror = () => reject(new Error('YouTube IFrame API blocked'));
      document.head.appendChild(script);
      window.setTimeout(() => reject(new Error('YouTube IFrame API timeout')), 12_000);
    }).catch((error: unknown) => {
      ytApiPromise = null;
      throw error;
    });
  }
  return ytApiPromise;
};

const fetchIframeStatus = async (videoId: string): Promise<LiveStatus | null> => {
  if (typeof window === 'undefined') return null;
  try {
    const YT = await loadYouTubeIframeApi();
    return await new Promise<LiveStatus | null>((resolve) => {
      let settled = false;
      let player: YTPlayerLike | null = null;
      let host: HTMLDivElement | null = null;
      let timer: number | null = null;

      const finish = (value: LiveStatus | null) => {
        if (settled) return;
        settled = true;
        if (timer !== null) window.clearTimeout(timer);
        try {
          player?.destroy?.();
        } catch {
          /* ignore a half-initialised player */
        }
        host?.remove();
        resolve(value);
      };

      const read = (target: YTPlayerLike) => {
        const data = target.getVideoData?.() ?? {};
        const viewersRaw = data.viewerCount;
        finish({
          isLive: data.isLive === true && data.errorCode == null,
          viewers: typeof viewersRaw === 'number' ? viewersRaw : null,
          title: typeof data.title === 'string' ? data.title : null,
          startedAt: null,
          degraded: false,
        });
      };

      host = document.createElement('div');
      host.setAttribute('aria-hidden', 'true');
      host.style.cssText =
        'position:absolute;left:-10000px;top:-10000px;width:1px;height:1px;opacity:0;pointer-events:none;';
      document.body.appendChild(host);

      player = new YT.Player(host, {
        videoId,
        playerVars: {
          autoplay: 0,
          mute: 1,
          controls: 0,
          playsinline: 1,
          origin: window.location.origin,
        },
        events: {
          onReady: (event: { target: YTPlayerLike }) => read(event.target),
          onError: () =>
            finish({ isLive: false, viewers: null, title: null, startedAt: null, degraded: false }),
        },
      });

      timer = window.setTimeout(() => finish(null), 10_000);
    });
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
  // Start offline, then let the first probe decide. Prevents a false green
  // LIVE flash while the broadcast is still scheduled.
  isLive: false,
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
