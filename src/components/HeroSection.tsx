import React from 'react';
import { Play, Calendar, ChevronRight, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  onOpenLive: () => void;
  onOpenVisit: () => void;
  onOpenPrayer: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenLive,
  onOpenVisit,
  onOpenPrayer,
}) => {
  return (
    <section className="relative overflow-hidden bg-slate-950 pt-10 sm:pt-14 pb-16">
      {/* Subtle architectural ambient gradient backdrop */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,rgba(30,58,138,0.28),transparent_65%),radial-gradient(circle_at_bottom_right,rgba(234,179,8,0.08),transparent_55%)] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top-of-page Marquee Headline (images sit cleanly below) */}
        <div className="text-center max-w-6xl mx-auto">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl xl:text-[3.75rem] font-extrabold tracking-tight leading-[1.12] text-balance drop-shadow-sm">
            <span className="text-blue-400">Supernatural Church</span>
            <span className="text-slate-500 mx-1 sm:mx-2">-</span>
            <span className="text-yellow-300">Changing Lives</span>
            <span className="text-slate-500 mx-1 sm:mx-2">-</span>
            <span className="text-white">Disciple the Nations</span>
          </h1>
        </div>

        {/* Below Headline: Balanced 2-Column Focal Image + Declaration Split */}
        <div className="mt-9 sm:mt-11 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          {/* Dominant HD Hero Visual (Image 1) */}
          <div className="lg:col-span-7 relative rounded-3xl overflow-hidden border border-white/15 bg-black shadow-2xl min-h-[280px] sm:min-h-[380px] lg:min-h-[430px] group">
            <img
              src="assets/aistudio/image1_e0e6cad4.jfif"
              alt="Prophet Herbert Mulondo ministering at Revival Church International"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-[center_18%] group-hover:scale-[1.02] transition-transform duration-700"
            />
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/95 via-black/55 to-transparent pointer-events-none" />
            <div className="absolute bottom-5 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
              <div>
                <div className="text-xs font-medium text-yellow-300 tracking-wide">
                  Revival Altar · Sandton HQ &amp; Global Campuses
                </div>
                <div className="text-lg sm:text-2xl font-bold text-white mt-0.5 leading-snug">
                  Where the Word Works &amp; Lives Are Transformed
                </div>
              </div>
            </div>
          </div>

          {/* Declaration & Primary Conversion Panel */}
          <div className="lg:col-span-5 rounded-3xl bg-slate-900/80 border border-white/10 p-6 sm:p-8 shadow-2xl flex flex-col justify-between text-left backdrop-blur-sm">
            <div className="space-y-4">
              <div className="text-xs font-semibold tracking-wide text-blue-400">
                Revival Church International
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-yellow-300">
                The Soil of Solutions.
              </h2>
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
                The place where your story changes, where the Word works and where you{' '}
                <span className="font-bold text-white">ALWAYS</span> come back with a testimony.
                This is not just a church but truly a family that loves and cares for each other.
                We serve God’s people with excellence and compassion.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 space-y-3">
              <button
                type="button"
                onClick={onOpenVisit}
                className="w-full px-6 py-3.5 text-sm sm:text-base font-bold text-white bg-blue-600 hover:bg-blue-500 active:scale-[0.99] rounded-xl transition-all shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2.5 cursor-pointer whitespace-nowrap"
              >
                <Calendar className="w-4 h-4 text-blue-200 shrink-0" />
                <span>Plan Your Visit This Sunday</span>
                <ChevronRight className="w-4 h-4 shrink-0" />
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={onOpenLive}
                  className="px-4 py-3 text-xs sm:text-sm font-semibold text-slate-100 bg-slate-950/90 hover:bg-slate-800 border border-slate-700/80 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                >
                  <Play className="w-4 h-4 text-red-500 fill-red-500 shrink-0" />
                  <span>Watch Live Online</span>
                </button>

                <button
                  type="button"
                  onClick={onOpenPrayer}
                  className="px-4 py-3 text-xs sm:text-sm font-medium text-slate-200 hover:text-white bg-transparent hover:bg-white/5 border border-white/15 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                >
                  <Sparkles className="w-4 h-4 text-yellow-300 shrink-0" />
                  <span>Prayer Request</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sunday Service Time Line Below Hero Split */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-xs sm:text-sm text-slate-300 font-medium">
          <span className="font-bold text-white tabular-nums">10:00 &amp; 17:00</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>Sunday Services (CAT)</span>
        </div>
      </div>
    </section>
  );
};
