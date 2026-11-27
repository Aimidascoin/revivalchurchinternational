import React from 'react';
import { useLiveStatus } from '../lib/liveStream';

interface LiveIndicatorProps {
  /** Text shown beside the light. Empty string renders the light only. */
  label?: string;
  /** Keep rendering nothing while YouTube still reports the stream as offline. */
  hideWhenOffline?: boolean;
  className?: string;
}

/**
 * Flickering green "we are on air" light shown site-wide whenever the YouTube
 * broadcast is actually live, so visitors always know a stream is running.
 */
export const LiveIndicator: React.FC<LiveIndicatorProps> = ({
  label = 'LIVE NOW',
  hideWhenOffline = true,
  className = '',
}) => {
  const { isLive, loading } = useLiveStatus();

  if (loading || (!isLive && hideWhenOffline)) return null;

  const light = (
    <span className="relative flex h-2 w-2 shrink-0">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_2px_rgba(16,185,129,0.75)]" />
    </span>
  );

  if (!label) return <span className={`inline-flex ${className}`}>{light}</span>;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-emerald-500/50 bg-emerald-600/15 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-300 ${className}`}
    >
      {light}
      {label}
    </span>
  );
};
