import React from 'react';
import { Users } from 'lucide-react';
import { embedUrl, useLiveStatus } from '../lib/liveStream';
import { LiveIndicator } from './LiveIndicator';

/** Faded still shown while the stream is OFF (moved from the gallery folder). */
const offlineImg = 'images/offline_thumbnail.png';

interface LiveStreamPlayerProps {
  /** Extra classes applied to the 16:9 frame. */
  className?: string;
}

/**
 * RCI-branded live player.
 *
 * The broadcast is delivered through the church's private embed (branding
 * suppressed with modestbranding), so viewers only ever see the Revival Church
 * International experience: the flickering green LIVE light, the RCI plate and
 * our own viewer counter. While the stream is offline the frame simply reads
 * OFFLINE — that word disappears the moment the stream goes live.
 *
 * Encoder/ingest settings stay in the backend (VITE_YOUTUBE_LIVE_ID /
 * YOUTUBE_STREAM_KEY) and are never rendered here.
 */
export const LiveStreamPlayer: React.FC<LiveStreamPlayerProps> = ({ className = '' }) => {
  const status = useLiveStatus();
  const embed = embedUrl({ autoplay: true, muted: true });
  const isLive = status.isLive && embed !== null;
  const viewers = status.viewers;

  return (
    <div
      className={`relative aspect-video w-full overflow-hidden bg-slate-950 ${className}`}
      data-live={isLive ? 'true' : 'false'}
    >
      {isLive ? (
        <>
          <iframe
            src={embed}
            title="Revival Church International live service"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0"
          />

          {/* RCI broadcast chrome — drawn over the player, never blocking its controls */}
          <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-2">
            <span className="rounded-md bg-blue-600 px-2 py-1 text-[10px] font-black tracking-widest text-white shadow-lg">
              RCI
            </span>
            <LiveIndicator label="LIVE" />
          </div>

          {viewers !== null && (
            <div className="pointer-events-none absolute right-3 top-3">
              <span className="inline-flex items-center gap-1.5 rounded border border-white/10 bg-slate-950/75 px-2.5 py-1 font-mono text-[11px] font-bold text-white backdrop-blur">
                <Users className="h-3 w-3 text-emerald-400" />
                {viewers.toLocaleString()} watching
              </span>
            </div>
          )}
        </>
      ) : (
        <>
          <img
            src={offlineImg}
            alt="Revival Church International global gathering"
            referrerPolicy="no-referrer"
            className="absolute inset-0 h-full w-full object-cover brightness-[0.45] saturate-[0.85]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/50" />

          <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
            <span className="text-3xl font-black uppercase tracking-[0.4em] text-slate-400 drop-shadow sm:text-4xl">
              {status.loading ? '' : 'Offline'}
            </span>
          </div>
        </>
      )}
    </div>
  );
};
