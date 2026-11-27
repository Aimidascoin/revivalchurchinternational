import React from 'react';
import { Bell, ExternalLink, Radio, Settings2, Users } from 'lucide-react';
import {
  embedUrl,
  formatCountdown,
  hasLiveVideo,
  liveStream,
  nextServiceDate,
  useLiveStatus,
  watchUrl,
} from '../lib/liveStream';

const heroImg = 'images/hero_revival_worship_1790800192961.jpg';

interface LiveStreamPlayerProps {
  /** Extra classes applied to the 16:9 frame. */
  className?: string;
}

/**
 * Real YouTube Live embed for the RCI broadcast.
 * Falls back to a scheduled/offline state with the next service countdown
 * when no broadcast is configured or YouTube reports the stream is offline.
 */
export const LiveStreamPlayer: React.FC<LiveStreamPlayerProps> = ({ className = '' }) => {
  const status = useLiveStatus();
  const embed = embedUrl({ autoplay: true, muted: true });
  const isLive = status.isLive && embed !== null;
  const next = nextServiceDate();
  const viewers = status.viewers;

  return (
    <div
      className={`relative aspect-video w-full overflow-hidden bg-slate-950 ${className}`}
      data-live={isLive ? 'true' : 'false'}
    >
      {isLive ? (
        <iframe
          src={embed}
          title="Revival Church International live service"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      ) : (
        <>
          <img
            src={heroImg}
            alt="Revival Church International worship gathering"
            referrerPolicy="no-referrer"
            className="absolute inset-0 h-full w-full object-cover brightness-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/40" />

          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-500/40 bg-blue-600/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-blue-300">
              <Radio className="h-3.5 w-3.5" />
              {status.loading ? 'Checking broadcast…' : 'Between Services'}
            </span>

            <h3 className="text-xl font-black text-white drop-shadow sm:text-2xl">
              {status.loading
                ? 'Preparing the altar'
                : hasLiveVideo
                  ? 'The broadcast is offline right now'
                  : 'The live altar is being prepared'}
            </h3>

            {!status.loading && (
              <p className="max-w-md text-xs leading-relaxed text-slate-300 sm:text-sm">
                Next gathering in{' '}
                <strong className="font-mono text-amber-300">{formatCountdown(next)}</strong> —{' '}
                {next.toLocaleDateString(undefined, {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                })}{' '}
                at{' '}
                {next.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}.
              </p>
            )}

            <div className="flex flex-wrap items-center justify-center gap-2.5">
              <a
                href={watchUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-red-500"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Watch on YouTube
              </a>
              <a
                href={`${watchUrl}?sub_confirmation=1`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-2.5 text-xs font-bold text-slate-200 transition-colors hover:bg-slate-800"
              >
                <Bell className="h-3.5 w-3.5" />
                Get Reminder
              </a>
            </div>

            <details className="group max-w-lg text-left">
              <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 text-[11px] font-semibold text-slate-500 transition-colors hover:text-slate-300">
                <Settings2 className="h-3 w-3" />
                Broadcast team: encoder settings
              </summary>
              <div className="mt-2 rounded-xl border border-slate-800 bg-slate-950/90 p-3 font-mono text-[11px] leading-relaxed text-slate-400">
                <div>
                  <span className="text-slate-500">Server:</span> {liveStream.rtmpIngestUrl}
                </div>
                <div>
                  <span className="text-slate-500">Stream key:</span> {liveStream.streamKeyEnv}
                </div>
                <div>
                  <span className="text-slate-500">Schedule:</span> {liveStream.schedule}
                </div>
                <div className="mt-1 text-slate-500">
                  Paste the scheduled broadcast id into the VITE_YOUTUBE_LIVE_ID repo variable to
                  embed it here.
                </div>
              </div>
            </details>
          </div>
        </>
      )}

      {/* Status overlay — hidden while the YouTube player itself is visible */}
      {!isLive && (
        <div className="pointer-events-none absolute left-4 top-4 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded border border-white/10 bg-slate-950/70 px-2.5 py-1 font-mono text-[11px] font-bold text-slate-300 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
            {liveStream.schedule}
          </span>
        </div>
      )}

      {isLive && viewers !== null && (
        <div className="pointer-events-none absolute right-4 top-4">
          <span className="inline-flex items-center gap-1.5 rounded border border-white/10 bg-slate-950/70 px-2.5 py-1 font-mono text-[11px] font-bold text-white backdrop-blur">
            <Users className="h-3 w-3 text-blue-400" />
            {viewers.toLocaleString()} watching
          </span>
        </div>
      )}
    </div>
  );
};
