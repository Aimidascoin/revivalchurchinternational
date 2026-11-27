import React, { useState, useEffect, useRef } from 'react';
import {
  Heart,
  MapPin,
  Sparkles,
  Download,
  ChevronDown,
  ArrowRight,
  Play,
  Home,
} from 'lucide-react';
import { LiveIndicator } from './LiveIndicator';
import { useLiveStatus } from '../lib/liveStream';

export type AppPage = 'home' | 'connect' | 'membership' | 'watch' | 'care' | 'ministries' | 'campuses' | 'give';

interface NavbarProps {
  currentPage: AppPage;
  onNavigate: (page: AppPage) => void;
  onOpenLive: () => void;
  onOpenGive: () => void;
  onOpenVisit: () => void;
  onOpenPrayer: () => void;
  onOpenDownload: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  onOpenLive,
  onOpenGive,
  onOpenVisit,
  onOpenPrayer,
  onOpenDownload,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const liveStatus = useLiveStatus();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePageClick = (page: AppPage, targetAnchor?: string) => {
    setOpenDropdown(null);
    onNavigate(page);
    if (targetAnchor) {
      setTimeout(() => {
        const el = document.getElementById(targetAnchor.replace('#', ''));
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        else window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full max-w-full relative">
      {/* Top micro announcement bar */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-950 text-xs py-1.5 px-3 sm:px-4 border-b border-white/10 w-full overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0 truncate">
            {liveStatus.isLive && !liveStatus.loading ? (
              <>
                <LiveIndicator label="LIVE" className="shrink-0" />
                <button
                  onClick={onOpenLive}
                  className="text-emerald-200 hover:text-emerald-100 font-semibold truncate text-[11px] sm:text-xs cursor-pointer text-left"
                >
                  The service is streaming right now — tap to watch
                </button>
              </>
            ) : (
              <>
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400/70 shrink-0" />
                <button
                  onClick={onOpenLive}
                  className="text-slate-200 hover:text-white font-medium truncate text-[11px] sm:text-xs cursor-pointer text-left"
                >
              Live Broadcast: Sunday 10:00 AM &amp; 17:00 PM CAT · Watch Live
                </button>
              </>
            )}
          </div>
          <div className="flex items-center gap-2 sm:gap-3 text-slate-300 shrink-0">
            <button
              onClick={onOpenGive}
              className="hidden md:flex items-center gap-1 text-amber-300 hover:text-amber-200 transition-colors cursor-pointer text-xs"
            >
              <Heart className="h-3.5 w-3.5" />
              <span>Give Now</span>
            </button>
            <span className="text-slate-600 hidden md:inline">|</span>
            <button
              onClick={onOpenDownload}
              className="px-2.5 py-0.5 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 hover:text-white border border-blue-400/40 transition-colors flex items-center gap-1 cursor-pointer font-semibold text-[11px] whitespace-nowrap"
            >
              <Download className="w-3 h-3 text-blue-300 shrink-0" />
              <span>Download Files</span>
            </button>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <button
              onClick={onOpenPrayer}
              className="hover:text-blue-300 transition-colors hidden sm:flex items-center gap-1 cursor-pointer text-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Need Prayer?</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Top Navigation Header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 w-full max-w-full ${
          isScrolled
            ? 'bg-slate-950/98 backdrop-blur-md border-b border-slate-800 shadow-2xl'
            : 'bg-slate-950/95 backdrop-blur-sm border-b border-white/10 shadow-lg'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-8 w-full" ref={navRef}>
          <div className="h-20 flex items-center justify-between gap-2 lg:gap-3 w-full">
            {/* Zone 1: Single text element wordmark -> Navigates to Home Page */}
            <button
              type="button"
              onClick={() => handlePageClick('home')}
              className="flex items-center gap-2 text-slate-100 group shrink-0 cursor-pointer text-left"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white shadow-md shadow-blue-500/20 group-hover:bg-blue-500 transition-colors shrink-0">
                <span className="text-base sm:text-lg tracking-tighter">RCI</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm sm:text-base font-bold tracking-tight text-white leading-tight whitespace-nowrap">
                  Revival Church International
                </span>
                <span className="text-[10px] sm:text-[11px] text-blue-400 font-medium tracking-wide hidden sm:inline leading-none">
                  Restore-Empower-Send
                </span>
              </div>
            </button>

            {/* Zone 2: Menu Buttons with Subheading Inside Each (Desktop Screens >= 1024px) */}
            <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1 shrink-0">
              {/* 0. Home Page */}
              <button
                type="button"
                onClick={() => handlePageClick('home')}
                className={`group flex items-center gap-1.5 px-2 xl:px-2.5 py-2 rounded-xl transition-all cursor-pointer text-left border ${
                  currentPage === 'home'
                    ? 'bg-blue-600/20 border-blue-500 text-white shadow-lg shadow-blue-500/10'
                    : 'border-transparent hover:bg-slate-900/90 hover:border-slate-800'
                }`}
              >
                <Home className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                <div className="flex flex-col leading-none">
                  <span className="text-xs xl:text-sm font-bold text-slate-100 group-hover:text-white transition-colors">
                    Home
                  </span>
                  <span className="text-[10px] text-slate-400 font-normal group-hover:text-blue-300 transition-colors mt-0.5 whitespace-nowrap">
                    Welcome
                  </span>
                </div>
              </button>

              {/* 1. Connect Page */}
              <div
                className="relative"
                onMouseEnter={() => setOpenDropdown('connect')}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button
                  type="button"
                  onClick={() => handlePageClick('connect')}
                  className={`group flex items-center gap-1 px-2 xl:px-2.5 py-2 rounded-xl transition-all cursor-pointer text-left border ${
                    currentPage === 'connect'
                      ? 'bg-blue-600/20 border-blue-500 text-white shadow-lg shadow-blue-500/10'
                      : 'border-transparent hover:bg-slate-900/90 hover:border-slate-800'
                  }`}
                >
                  <div className="flex flex-col leading-none">
                    <div className="flex items-center gap-1">
                      <span className="text-xs xl:text-sm font-bold text-slate-100 group-hover:text-white transition-colors">
                        Connect
                      </span>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-300" />
                    </div>
                    <span className="text-[10px] text-slate-400 font-normal group-hover:text-blue-300 transition-colors mt-0.5 whitespace-nowrap">
                      About &amp; Groups
                    </span>
                  </div>
                </button>

                {openDropdown === 'connect' && (
                  <div className="absolute top-full left-0 w-72 pt-1.5 z-50">
                    <div className="bg-slate-900 border border-slate-700/80 rounded-2xl p-2.5 shadow-2xl space-y-1 text-xs backdrop-blur-md">
                      <div className="px-3 py-1.5 border-b border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                        <span>Connect Menu</span>
                        <span className="text-blue-400 font-mono">Quick Navigation</span>
                      </div>

                      <button
                        onClick={() => handlePageClick('connect', '#about')}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-200 hover:text-white transition-colors cursor-pointer"
                      >
                        <div className="font-bold text-white text-xs">About</div>
                        <div className="text-[11px] text-slate-400">Vision, history &amp; apostolic heart</div>
                      </button>

                      <button
                        onClick={() => handlePageClick('connect', '#leadership')}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-200 hover:text-white transition-colors cursor-pointer"
                      >
                        <div className="font-bold text-white text-xs">Meet the team</div>
                        <div className="text-[11px] text-slate-400">Prophet Herbert &amp; Pastor Shelma Mulondo</div>
                      </button>

                      <button
                        onClick={() => handlePageClick('connect', '#faith')}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-200 hover:text-white transition-colors cursor-pointer"
                      >
                        <div className="font-bold text-white text-xs">Statement of faith</div>
                        <div className="text-[11px] text-slate-400">Core doctrinal pillars &amp; truths</div>
                      </button>

                      <button
                        onClick={() => handlePageClick('connect', '#groups')}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-200 hover:text-white transition-colors cursor-pointer"
                      >
                        <div className="font-bold text-amber-300 text-xs">Revival groups</div>
                        <div className="text-[11px] text-slate-400">Mid-week home hubs &amp; Zoom groups</div>
                      </button>

                      <div className="border-t border-slate-800/80 my-1" />

                      <button
                        onClick={() => handlePageClick('connect')}
                        className="w-full text-left px-3 py-2 rounded-xl bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 font-bold flex items-center justify-between transition-colors cursor-pointer"
                      >
                        <span>Open Connect Page</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* 2. Membership Page */}
              <div
                className="relative"
                onMouseEnter={() => setOpenDropdown('membership')}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button
                  type="button"
                  onClick={() => handlePageClick('membership')}
                  className={`group flex items-center gap-1 px-2 xl:px-2.5 py-2 rounded-xl transition-all cursor-pointer text-left border ${
                    currentPage === 'membership'
                      ? 'bg-blue-600/20 border-blue-500 text-white shadow-lg shadow-blue-500/10'
                      : 'border-transparent hover:bg-slate-900/90 hover:border-slate-800'
                  }`}
                >
                  <div className="flex flex-col leading-none">
                    <div className="flex items-center gap-1">
                      <span className="text-xs xl:text-sm font-bold text-slate-100 group-hover:text-white transition-colors">
                        Membership
                      </span>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-300" />
                    </div>
                    <span className="text-[10px] text-slate-400 font-normal group-hover:text-blue-300 transition-colors mt-0.5 whitespace-nowrap">
                      Next Steps
                    </span>
                  </div>
                </button>

                {openDropdown === 'membership' && (
                  <div className="absolute top-full left-0 w-64 pt-1.5 z-50">
                    <div className="bg-slate-900 border border-slate-700/80 rounded-2xl p-2.5 shadow-2xl space-y-1 text-xs backdrop-blur-md">
                      <button
                        onClick={() => handlePageClick('membership', '#pathway')}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-200 hover:text-white transition-colors cursor-pointer"
                      >
                        <div className="font-bold text-white text-xs">Discipleship Pathway</div>
                        <div className="text-[11px] text-slate-400">Structured 6-step journey</div>
                      </button>
                      <button
                        onClick={() => handlePageClick('membership', '#register')}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-200 hover:text-white transition-colors cursor-pointer"
                      >
                        <div className="font-bold text-white text-xs">Enroll in Cohort</div>
                        <div className="text-[11px] text-slate-400">Foundations 101 &amp; V-Team</div>
                      </button>
                      <div className="border-t border-slate-800/80 my-1" />
                      <button
                        onClick={() => handlePageClick('membership')}
                        className="w-full text-left px-3 py-2 rounded-xl bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 font-bold flex items-center justify-between transition-colors cursor-pointer"
                      >
                        <span>Open Membership Page</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* 3. Watch Page */}
              <div
                className="relative"
                onMouseEnter={() => setOpenDropdown('watch')}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button
                  type="button"
                  onClick={() => handlePageClick('watch')}
                  className={`group flex items-center gap-1 px-2 xl:px-2.5 py-2 rounded-xl transition-all cursor-pointer text-left border ${
                    currentPage === 'watch'
                      ? 'bg-red-600/20 border-red-500 text-white shadow-lg shadow-red-500/10'
                      : 'border-transparent hover:bg-slate-900/90 hover:border-slate-800'
                  }`}
                >
                  <div className="flex flex-col leading-none">
                    <div className="flex items-center gap-1">
                      <span className="text-xs xl:text-sm font-bold text-slate-100 group-hover:text-white transition-colors">
                        Watch
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shrink-0" />
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-300" />
                    </div>
                    <span className="text-[10px] text-slate-400 font-normal group-hover:text-blue-300 transition-colors mt-0.5 whitespace-nowrap">
                      Live Stream
                    </span>
                  </div>
                </button>

                {openDropdown === 'watch' && (
                  <div className="absolute top-full left-0 w-64 pt-1.5 z-50">
                    <div className="bg-slate-900 border border-slate-700/80 rounded-2xl p-2.5 shadow-2xl space-y-1 text-xs backdrop-blur-md">
                      <button
                        onClick={onOpenLive}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 text-red-400 font-bold flex items-center justify-between cursor-pointer"
                      >
                        <span>4K Live Altar Broadcast</span>
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      </button>
                      <button
                        onClick={() => handlePageClick('watch', '#sermon-archive')}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-200 hover:text-white transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <Play className="w-3.5 h-3.5 fill-blue-400 text-blue-400 shrink-0" />
                          <div>
                            <div className="font-bold text-white text-xs">Video Sermons</div>
                            <div className="text-[11px] text-slate-400">Watch on-demand video messages</div>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* 3b. Video Sermons Dedicated Button */}
              <button
                type="button"
                onClick={() => handlePageClick('watch', '#sermon-archive')}
                className="group flex items-center gap-1.5 px-2 xl:px-2.5 py-2 rounded-xl transition-all cursor-pointer text-left border border-blue-500/30 bg-blue-950/20 hover:bg-blue-900/30 hover:border-blue-400 shrink-0 shadow-sm"
              >
                <div className="w-6 h-6 rounded-lg bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0 group-hover:scale-105 transition-transform">
                  <Play className="w-3 h-3 fill-blue-400 text-blue-400" />
                </div>
                <div className="flex flex-col leading-none">
                  <span className="text-xs xl:text-sm font-bold text-white group-hover:text-blue-200 transition-colors">
                    Video Sermons
                  </span>
                  <span className="text-[10px] text-blue-300 font-normal mt-0.5 whitespace-nowrap">
                    On-Demand
                  </span>
                </div>
              </button>

              {/* 4. Care Page */}
              <div
                className="relative"
                onMouseEnter={() => setOpenDropdown('care')}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button
                  type="button"
                  onClick={() => handlePageClick('care')}
                  className={`group flex items-center gap-1 px-2 xl:px-2.5 py-2 rounded-xl transition-all cursor-pointer text-left border ${
                    currentPage === 'care'
                      ? 'bg-amber-500/20 border-amber-500 text-white shadow-lg shadow-amber-500/10'
                      : 'border-transparent hover:bg-slate-900/90 hover:border-slate-800'
                  }`}
                >
                  <div className="flex flex-col leading-none">
                    <div className="flex items-center gap-1">
                      <span className="text-xs xl:text-sm font-bold text-slate-100 group-hover:text-white transition-colors">
                        Care
                      </span>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-300" />
                    </div>
                    <span className="text-[10px] text-slate-400 font-normal group-hover:text-blue-300 transition-colors mt-0.5 whitespace-nowrap">
                      Prayer &amp; Pastoral
                    </span>
                  </div>
                </button>

                {openDropdown === 'care' && (
                  <div className="absolute top-full left-0 w-64 pt-1.5 z-50">
                    <div className="bg-slate-900 border border-slate-700/80 rounded-2xl p-2.5 shadow-2xl space-y-1 text-xs backdrop-blur-md">
                      <button
                        onClick={onOpenPrayer}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 text-amber-400 font-bold cursor-pointer"
                      >
                        Submit Prayer Request
                      </button>
                      <button
                        onClick={() => handlePageClick('care', '#pastoral-care')}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-200 hover:text-white transition-colors cursor-pointer"
                      >
                        <div className="font-bold text-white text-xs">Pastoral Counseling</div>
                        <div className="text-[11px] text-slate-400">Hospital &amp; home visits</div>
                      </button>
                      <button
                        onClick={() => handlePageClick('care', '#compassion')}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-200 hover:text-white transition-colors cursor-pointer"
                      >
                        <div className="font-bold text-white text-xs">Revival Hope Relief</div>
                        <div className="text-[11px] text-slate-400">Food bank &amp; compassion</div>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* 5. Ministries Page with 11 Ministries Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setOpenDropdown('ministries')}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button
                  type="button"
                  onClick={() => handlePageClick('ministries')}
                  className={`group flex items-center gap-1 px-2 xl:px-2.5 py-2 rounded-xl transition-all cursor-pointer text-left border ${
                    currentPage === 'ministries'
                      ? 'bg-blue-600/20 border-blue-500 text-white shadow-lg shadow-blue-500/10'
                      : 'border-transparent hover:bg-slate-900/90 hover:border-slate-800'
                  }`}
                >
                  <div className="flex flex-col leading-none">
                    <div className="flex items-center gap-1">
                      <span className="text-xs xl:text-sm font-bold text-slate-100 group-hover:text-white transition-colors">
                        Ministries
                      </span>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-300" />
                    </div>
                    <span className="text-[10px] text-slate-400 font-normal group-hover:text-blue-300 transition-colors mt-0.5 whitespace-nowrap">
                      11 Departments
                    </span>
                  </div>
                </button>

                {openDropdown === 'ministries' && (
                  <div className="absolute top-full left-0 w-80 pt-1.5 z-50">
                    <div className="bg-slate-900 border border-slate-700/80 rounded-2xl p-2.5 shadow-2xl space-y-0.5 text-xs backdrop-blur-md max-h-[480px] overflow-y-auto no-scrollbar">
                      <div className="px-3 py-1.5 border-b border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                        <span>Church Ministries</span>
                        <span className="text-blue-400 font-mono">11 Available</span>
                      </div>
                      
                      <button
                        onClick={() => handlePageClick('ministries')}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-slate-200 hover:text-white transition-colors cursor-pointer"
                      >
                        <div className="font-bold text-white text-xs">1. Unstoppablegenr (Youth &amp; Campus)</div>
                        <div className="text-[10px] text-slate-400">Campus rallies &amp; fire gatherings</div>
                      </button>

                      <button
                        onClick={() => handlePageClick('ministries')}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-slate-200 hover:text-white transition-colors cursor-pointer"
                      >
                        <div className="font-bold text-white text-xs">2. Usher Ministry</div>
                        <div className="text-[10px] text-slate-400">Sanctuary protocols &amp; VIP greeting</div>
                      </button>

                      <button
                        onClick={() => handlePageClick('ministries')}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-slate-200 hover:text-white transition-colors cursor-pointer"
                      >
                        <div className="font-bold text-blue-300 text-xs">3. Revival Worship Ministry</div>
                        <div className="text-[10px] text-slate-400">Prophetic psalmists &amp; adoration</div>
                      </button>

                      <button
                        onClick={() => handlePageClick('ministries')}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-slate-200 hover:text-white transition-colors cursor-pointer"
                      >
                        <div className="font-bold text-pink-300 text-xs">4. Queen Reigning Women's Ministry</div>
                        <div className="text-[10px] text-slate-400">Virtuous women crowned in power</div>
                      </button>

                      <button
                        onClick={() => handlePageClick('ministries')}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-slate-200 hover:text-white transition-colors cursor-pointer"
                      >
                        <div className="font-bold text-amber-300 text-xs">5. Children Church Ministry</div>
                        <div className="text-[10px] text-slate-400">Ages 1–12 Bible truth &amp; praise</div>
                      </button>

                      <button
                        onClick={() => handlePageClick('ministries')}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-slate-200 hover:text-white transition-colors cursor-pointer"
                      >
                        <div className="font-bold text-indigo-300 text-xs">6. Supernatural Bible School</div>
                        <div className="text-[10px] text-slate-400">Signs, wonders &amp; apostolic diploma</div>
                      </button>

                      <button
                        onClick={() => handlePageClick('ministries')}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-slate-200 hover:text-white transition-colors cursor-pointer"
                      >
                        <div className="font-bold text-emerald-300 text-xs">7. Herbert Mulondo Compassion Foundation</div>
                        <div className="text-[10px] text-slate-400">Humanitarian relief &amp; bursaries</div>
                      </button>

                      <button
                        onClick={() => handlePageClick('ministries')}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-slate-200 hover:text-white transition-colors cursor-pointer"
                      >
                        <div className="font-bold text-teal-300 text-xs">8. Dorcas Ministry</div>
                        <div className="text-[10px] text-slate-400">Widows support &amp; practical charity</div>
                      </button>

                      <button
                        onClick={() => handlePageClick('ministries')}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-slate-200 hover:text-white transition-colors cursor-pointer"
                      >
                        <div className="font-bold text-white text-xs">9. Revival Groups</div>
                        <div className="text-[10px] text-slate-400">Home hubs &amp; online eGroups</div>
                      </button>

                      <button
                        onClick={() => handlePageClick('ministries')}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-slate-200 hover:text-white transition-colors cursor-pointer"
                      >
                        <div className="font-bold text-red-400 text-xs">10. Media &amp; Video Ministry</div>
                        <div className="text-[10px] text-slate-400">4K livestreaming &amp; broadcast production</div>
                      </button>

                      <button
                        onClick={() => handlePageClick('ministries')}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-slate-200 hover:text-white transition-colors cursor-pointer"
                      >
                        <div className="font-bold text-blue-400 text-xs">11. Knight Men Ministry</div>
                        <div className="text-[10px] text-slate-400">Mighty men standing in authority</div>
                      </button>

                      <div className="border-t border-slate-800/80 my-1 pt-1" />

                      <button
                        onClick={() => handlePageClick('ministries', '#volunteer')}
                        className="w-full text-left px-3 py-2 rounded-xl bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 font-bold flex items-center justify-between transition-colors cursor-pointer"
                      >
                        <span>Apply for Ministry Placement</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* 6. Give Page */}
              <button
                type="button"
                onClick={() => handlePageClick('give')}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold shadow-md shadow-amber-400/20 transition-all cursor-pointer hover:scale-105 active:scale-95 text-left shrink-0"
              >
                <Heart className="w-3.5 h-3.5 fill-slate-950 text-slate-950 shrink-0" />
                <div className="flex flex-col leading-none">
                  <span className="text-xs xl:text-sm font-black text-slate-950">Give</span>
                  <span className="text-[9px] xl:text-[10px] font-bold text-amber-950/80 mt-0.5 whitespace-nowrap">
                    Tithe &amp; Partner
                  </span>
                </div>
              </button>

              {/* 7. Locations Page */}
              <button
                type="button"
                onClick={() => handlePageClick('campuses')}
                className={`group flex items-center gap-1.5 px-2 xl:px-2.5 py-2 rounded-xl transition-all cursor-pointer text-left border ${
                  currentPage === 'campuses'
                    ? 'bg-blue-600/20 border-blue-500 text-white shadow-lg shadow-blue-500/10'
                    : 'border-transparent hover:bg-slate-900/90 hover:border-slate-800'
                }`}
              >
                <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                <div className="flex flex-col leading-none">
                  <span className="text-xs xl:text-sm font-bold text-slate-100 group-hover:text-white transition-colors">
                    Locations
                  </span>
                  <span className="text-[10px] text-slate-400 font-normal group-hover:text-blue-300 transition-colors mt-0.5 whitespace-nowrap">
                    Campuses &amp; Times
                  </span>
                </div>
              </button>
            </nav>

            {/* Zone 3: Primary Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={onOpenLive}
                className="hidden sm:flex lg:hidden px-2.5 py-1.5 text-xs font-semibold text-slate-200 bg-slate-900 border border-slate-700 rounded-lg items-center gap-1.5 cursor-pointer"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <span>Live</span>
              </button>
              <button
                onClick={onOpenVisit}
                className="px-3.5 sm:px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-md shadow-blue-600/30 whitespace-nowrap cursor-pointer hover:translate-y-[-1px]"
              >
                Plan Your Visit
              </button>
            </div>
          </div>

          {/* Sub-strip: Menu Buttons Horizontal Side-by-Side (Active on Mobile & Tablet < 1024px) */}
          <div className="flex lg:hidden items-center justify-between gap-1 overflow-x-auto py-2.5 border-t border-slate-800/80 no-scrollbar text-xs font-semibold w-full">
            {/* 0. Home Page */}
            <button
              type="button"
              onClick={() => handlePageClick('home')}
              className={`px-2.5 py-1 rounded-xl whitespace-nowrap flex flex-col items-center cursor-pointer transition-colors ${
                currentPage === 'home' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              <span className="font-bold text-xs flex items-center gap-1">
                <Home className="w-3 h-3" />
                Home
              </span>
              <span className="text-[9px] opacity-80">Welcome</span>
            </button>

            {/* 1. Connect Page */}
            <button
              type="button"
              onClick={() => handlePageClick('connect')}
              className={`px-2.5 py-1 rounded-xl whitespace-nowrap flex flex-col items-center cursor-pointer transition-colors ${
                currentPage === 'connect' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              <span className="font-bold text-xs">Connect</span>
              <span className="text-[9px] opacity-80">About &amp; Groups</span>
            </button>

            {/* 2. Membership Page */}
            <button
              type="button"
              onClick={() => handlePageClick('membership')}
              className={`px-2.5 py-1 rounded-xl whitespace-nowrap flex flex-col items-center cursor-pointer transition-colors ${
                currentPage === 'membership' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              <span className="font-bold text-xs">Membership</span>
              <span className="text-[9px] opacity-80">Next Steps</span>
            </button>

            {/* 3. Watch Page */}
            <button
              type="button"
              onClick={() => handlePageClick('watch')}
              className={`px-2.5 py-1 rounded-xl whitespace-nowrap flex flex-col items-center cursor-pointer transition-colors ${
                currentPage === 'watch' ? 'bg-red-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              <span className="font-bold text-xs flex items-center gap-1">
                Watch
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              </span>
              <span className="text-[9px] opacity-80">Live Stream</span>
            </button>

            {/* 3b. Video Sermons Button */}
            <button
              type="button"
              onClick={() => handlePageClick('watch', '#sermon-archive')}
              className="px-2.5 py-1 rounded-xl whitespace-nowrap flex flex-col items-center cursor-pointer transition-colors text-slate-300 hover:text-white"
            >
              <span className="font-bold text-xs flex items-center gap-1 text-blue-400">
                <Play className="w-3 h-3 fill-blue-400 text-blue-400" />
                Video Sermons
              </span>
              <span className="text-[9px] opacity-80">On-Demand</span>
            </button>

            {/* 4. Care Page */}
            <button
              type="button"
              onClick={() => handlePageClick('care')}
              className={`px-2.5 py-1 rounded-xl whitespace-nowrap flex flex-col items-center cursor-pointer transition-colors ${
                currentPage === 'care' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              <span className="font-bold text-xs">Care</span>
              <span className="text-[9px] opacity-80">Prayer</span>
            </button>

            {/* 5. Ministries Page */}
            <button
              type="button"
              onClick={() => handlePageClick('ministries')}
              className={`px-2.5 py-1 rounded-xl whitespace-nowrap flex flex-col items-center cursor-pointer transition-colors ${
                currentPage === 'ministries' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              <span className="font-bold text-xs">Ministries</span>
              <span className="text-[9px] opacity-80">All Ages</span>
            </button>

            {/* 6. Give Page */}
            <button
              type="button"
              onClick={() => handlePageClick('give')}
              className={`px-2.5 py-1 rounded-xl whitespace-nowrap flex flex-col items-center cursor-pointer transition-colors ${
                currentPage === 'give' ? 'bg-amber-400 text-slate-950 font-black' : 'bg-amber-400/90 text-slate-950 font-bold'
              }`}
            >
              <span className="font-bold text-xs flex items-center gap-1">
                <Heart className="w-3 h-3 fill-slate-950" />
                Give
              </span>
              <span className="text-[9px] opacity-80">Tithe</span>
            </button>

            {/* 7. Locations Page */}
            <button
              type="button"
              onClick={() => handlePageClick('campuses')}
              className={`px-2.5 py-1 rounded-xl whitespace-nowrap flex flex-col items-center cursor-pointer transition-colors ${
                currentPage === 'campuses' ? 'bg-blue-600 text-white' : 'text-blue-400 hover:text-white'
              }`}
            >
              <span className="font-bold text-xs flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                Locations
              </span>
              <span className="text-[9px] opacity-80">Campuses</span>
            </button>
          </div>

          {/* Dedicated Connect Sub-Strip (Mobile & Tablet): About · Meet the team · Statement of faith */}
          {currentPage === 'connect' && (
            <div className="flex lg:hidden items-center gap-1.5 overflow-x-auto py-2 border-t border-slate-800/80 no-scrollbar text-xs bg-slate-950/80 px-1">
              <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider pl-1 shrink-0">
                Connect:
              </span>
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('about');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 hover:text-white font-bold whitespace-nowrap cursor-pointer text-xs"
              >
                About
              </button>
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('leadership');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 hover:text-white font-bold whitespace-nowrap cursor-pointer text-xs"
              >
                Meet the team
              </button>
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('faith');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 hover:text-white font-bold whitespace-nowrap cursor-pointer text-xs"
              >
                Statement of faith
              </button>
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('groups');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-amber-300 hover:text-amber-200 font-bold whitespace-nowrap cursor-pointer text-xs"
              >
                Revival groups
              </button>
            </div>
          )}
        </div>
      </header>
    </div>
  );
};
