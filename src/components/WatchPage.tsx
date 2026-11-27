import React, { useState, useEffect, useRef } from 'react';
import { LIVE_STREAM, SERMONS, Sermon } from '../data/churchData';
import { useContent } from '../context/ContentContext';
import { useToast } from './Toast';
import {
  Play,
  Pause,
  Send,
  Heart,
  Search,
  ArrowLeft,
  Clock,
  Download,
  Share2,
} from 'lucide-react';
import { api, errorMessage, type LiveChatMessage } from '../lib/api';
import { LiveStreamPlayer } from './LiveStreamPlayer';
import { useLiveStatus } from '../lib/liveStream';

interface WatchPageProps {
  onNavigateHome: () => void;
  onOpenGive: () => void;
  onOpenPrayer: () => void;
}

export const WatchPage: React.FC<WatchPageProps> = ({
  onNavigateHome,
  onOpenGive,
  onOpenPrayer,
}) => {
  // Live service interaction state (backed by the /api/live endpoints).
  const liveStatus = useLiveStatus();
  const [chatMessages, setChatMessages] = useState<LiveChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatSender, setChatSender] = useState('');
  const [chatError, setChatError] = useState('');
  const [chatOnline, setChatOnline] = useState<boolean | null>(null);
  const [amens, setAmens] = useState(0);

  // Load stats + recent chat, then poll for new messages while the page is open.
  const lastChatIdRef = useRef<string | undefined>(undefined);
  const knownChatIdsRef = useRef<Set<string>>(new Set());

  const applyIncomingMessages = (incoming: LiveChatMessage[]) => {
    const fresh = incoming.filter((message) => !knownChatIdsRef.current.has(message.id));
    if (fresh.length === 0) return;
    fresh.forEach((message) => knownChatIdsRef.current.add(message.id));
    lastChatIdRef.current = fresh[fresh.length - 1]?.id;
    setChatMessages((previous) => [...previous, ...fresh]);
  };

  useEffect(() => {
    let cancelled = false;

    const loadStats = async () => {
      try {
        const result = await api.liveStats();
        if (cancelled) return;
        setAmens(result.data?.amens ?? 0);
      } catch {
        /* stats are decorative; ignore */
      }
    };

    const loadChat = async () => {
      const after = lastChatIdRef.current;
      try {
        const result = await api.liveChat(after);
        if (cancelled) return;
        setChatOnline(true);
        setChatError('');
        applyIncomingMessages(result.data ?? []);
      } catch (cause) {
        if (cancelled) return;
        setChatOnline(false);
        if (after === undefined) setChatError(errorMessage(cause));
      }
    };

    void loadStats();
    void loadChat();
    const poll = window.setInterval(() => {
      void loadChat();
      void loadStats();
    }, 15_000);

    return () => {
      cancelled = true;
      window.clearInterval(poll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { content } = useContent();
  const toast = useToast();
  const sermons = content.sermons.length > 0 ? content.sermons : SERMONS;

  // Sermons search & filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeries, setSelectedSeries] = useState<string>('All');
  const [activeSermon, setActiveSermon] = useState<Sermon | null>(SERMONS[0]);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(18);

  useEffect(() => {
    if (!isPlayingAudio) return;
    const timer = window.setInterval(() => {
      setAudioProgress((current) => (current >= 100 ? 0 : current + 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [isPlayingAudio]);

  const elapsed = (() => {
    const totalMinutes = Number.parseInt(activeSermon?.duration ?? '52', 10) || 52;
    const seconds = Math.round((audioProgress / 100) * totalMinutes * 60);
    return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  })();

  const seriesList = ['All', ...Array.from(new Set(sermons.map((sermon) => sermon.series)))];

  const filteredSermons = sermons.filter((sermon) => {
    const matchesSearch =
      sermon.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sermon.speaker.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sermon.scripture.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeries =
      selectedSeries === 'All' || sermon.series === selectedSeries;
    return matchesSearch && matchesSeries;
  });

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = chatInput.trim();
    if (!text) return;

    const sender = chatSender.trim() || 'Online Guest';
    // Optimistic local echo so the altar feels instant even on a slow link.
    const optimistic: LiveChatMessage = {
      id: `local-${Date.now()}`,
      sender,
      location: 'Virtual Altar',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setChatMessages((previous) => [...previous, optimistic]);
    setChatInput('');
    setChatError('');

    try {
      const result = await api.postLiveChat({ sender, text, location: 'Virtual Altar' });
      if (result.data) {
        knownChatIdsRef.current.add(result.data.id);
        setChatMessages((previous) =>
          previous.map((message) => (message.id === optimistic.id ? (result.data as LiveChatMessage) : message)),
        );
      }
      setChatOnline(true);
    } catch (cause) {
      setChatOnline(false);
      setChatError(errorMessage(cause));
    }
  };

  const handleHeartReaction = async () => {
    const optimistic = amens + 1;
    setAmens(optimistic);
    try {
      const result = await api.reactAmen();
      if (typeof result.data?.amens === 'number') setAmens(result.data.amens);
    } catch {
      /* keep the optimistic count */
    }
  };

  const downloadNotes = (sermon: Sermon) => {
    const notes = [
      sermon.title,
      `${sermon.speaker} · ${sermon.scripture}`,
      '',
      ...sermon.keyPoints.map((point, index) => `${index + 1}. ${point}`),
      '',
      sermon.description,
    ].join('\n');
    const url = URL.createObjectURL(new Blob([notes], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `rci-notes-${sermon.id}.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    toast('Study notes downloaded.');
  };

  const copySermonLink = async () => {
    if (!activeSermon) return;
    try {
      await navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}#watch?sermon=${activeSermon.id}`);
      toast('Sermon link copied to clipboard.');
    } catch {
      toast('Clipboard access is unavailable in this browser.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Top Breadcrumb Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <button
              onClick={onNavigateHome}
              className="hover:text-white flex items-center gap-1 text-blue-400 font-bold transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Main Church Website</span>
            </button>
            <span>/</span>
            <span className="text-slate-200 font-medium">Watch · Live Stream &amp; Sermons</span>
          </div>

          <button
            onClick={onNavigateHome}
            className="self-start sm:self-auto px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </button>
        </div>

        {/* Live Broadcast Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold font-mono ${
                  liveStatus.isLive
                    ? 'bg-red-600/20 text-red-400 border-red-500/40 animate-pulse'
                    : 'bg-slate-900 text-slate-400 border-slate-700'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${liveStatus.isLive ? 'bg-red-500' : 'bg-slate-500'}`}
                />
                {liveStatus.isLive ? 'LIVE NOW' : 'OFFLINE'}
              </span>
              {liveStatus.isLive && liveStatus.viewers !== null && (
                <span className="text-xs text-slate-400 font-mono">
                  {liveStatus.viewers.toLocaleString()} Worshippers Online
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white">
              Global Encounter Service Altar
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Ministering live from Sandton Headquarters with Prophet Herbert &amp; Pastor Shelma Mulondo.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => {
                const el = document.getElementById('sermon-archive');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/30 flex items-center gap-1.5 cursor-pointer transition-transform hover:scale-105"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Video Sermons</span>
            </button>
            <button
              onClick={onOpenGive}
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md shadow-amber-400/20 cursor-pointer"
            >
              Sow Seed / Give Tithe
            </button>
            <button
              onClick={onOpenPrayer}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs shadow-md border border-slate-700 cursor-pointer"
            >
              Request Live Prayer
            </button>
          </div>
        </div>

        {/* Live Player & Interactive Chat Console */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Video Stream Frame */}
          <div className="lg:col-span-8 flex flex-col bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
            <LiveStreamPlayer />

            {/* Live interaction bar: connection state + Amen reaction */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 bg-slate-900 px-4 py-3">
              <span
                className={`inline-flex items-center gap-1.5 text-[11px] font-semibold ${
                  chatOnline === false ? 'text-amber-400' : 'text-emerald-400'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                {chatOnline === false
                  ? 'Offline mode — messages stay on this device'
                  : 'Fellowship chat connected'}
              </span>

              <button
                onClick={handleHeartReaction}
                className="px-4 py-2 rounded-xl bg-red-600/80 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-transform active:scale-105"
              >
                <Heart className="w-3.5 h-3.5 fill-white" />
                <span>Amen ({amens.toLocaleString()})</span>
              </button>
            </div>

            {/* Current Message Details Bar */}
            <div className="p-6 bg-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-800">
              <div className="space-y-1">
                <span className="text-xs font-mono font-bold text-blue-400">Current Prophetic Series</span>
                <h3 className="text-xl font-bold text-white">The Supernatural Law of Faith &amp; Kingdom Wealth</h3>
                <p className="text-xs text-slate-400">Key Scripture: Deuteronomy 8:18 · 2 Corinthians 9:6-11 · Mark 11:23</p>
              </div>

              <div className="text-xs text-slate-400 space-y-1 sm:text-right shrink-0">
                <div>Broadcast Times: <strong className="text-amber-400">{LIVE_STREAM.schedule}</strong></div>
              </div>
            </div>
          </div>

          {/* Live Chat Panel */}
          <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-3xl p-5 flex flex-col justify-between shadow-2xl h-[450px] lg:h-auto">
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    chatOnline === false ? 'bg-amber-400' : 'bg-emerald-400 animate-pulse'
                  }`}
                />
                <h4 className="text-sm font-bold text-white">Live Fellowship Chat</h4>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">Worldwide</span>
            </div>

            {/* Chat Messages Log */}
            <div className="flex-1 overflow-y-auto space-y-3 py-3 pr-1 text-xs no-scrollbar">
              {chatMessages.length === 0 && (
                <div className="rounded-xl border border-dashed border-slate-800 bg-slate-950/50 p-4 text-center text-[11px] leading-relaxed text-slate-500">
                  {chatOnline === false
                    ? 'Live chat needs the RCI server. Messages you send now stay on this device.'
                    : 'The altar is quiet. Be the first to share an Amen, a greeting or a testimony.'}
                </div>
              )}
              {chatMessages.map((msg) => (
                <div key={msg.id} className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-blue-400 text-[11px]">{msg.sender}</span>
                    <span className="text-[10px] text-slate-500">{msg.timestamp}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 italic">{msg.location}</div>
                  <p className="text-slate-200 text-xs">{msg.text}</p>
                </div>
              ))}
            </div>

            {/* Chat Input Box */}
            <form onSubmit={handleSendChat} className="pt-3 border-t border-slate-800 space-y-2">
              <input
                type="text"
                value={chatSender}
                onChange={(e) => setChatSender(e.target.value)}
                placeholder="Your Name (e.g. John from London)"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Type an Amen, testimony or greeting..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center justify-center cursor-pointer transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
              {chatError && <p className="text-[11px] text-amber-400">{chatError}</p>}
            </form>
          </div>
        </div>

        {/* ----------------- Sermons & Prophetic Media Archive ----------------- */}
        <section id="sermon-archive" className="space-y-6 pt-6 border-t border-slate-800 scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono font-bold uppercase text-blue-400">On-Demand Library</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Sermons &amp; Prophetic Teachings
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Stream full messages, download study outlines, and listen to weekly audio podcasts.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search scripture or title..."
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Series Categories */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar text-xs">
            {seriesList.map((series) => (
              <button
                key={series}
                onClick={() => setSelectedSeries(series)}
                className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-colors cursor-pointer border ${
                  selectedSeries === series
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {series}
              </button>
            ))}
          </div>

          {/* Sermon Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSermons.map((sermon) => {
              const isSelected = activeSermon?.id === sermon.id;
              return (
                <div
                  key={sermon.id}
                  className={`bg-slate-900 border rounded-2xl p-5 space-y-4 transition-all flex flex-col justify-between ${
                    isSelected ? 'border-blue-500 bg-slate-900/90 shadow-xl' : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-mono font-bold">
                        {sermon.series}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {sermon.duration}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white leading-snug">{sermon.title}</h4>
                    <p className="text-xs text-slate-400 font-medium">By {sermon.speaker}</p>
                    <p className="text-xs text-blue-300 font-mono">{sermon.scripture}</p>
                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{sermon.description}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                    <button
                      onClick={() => {
                        setActiveSermon(sermon);
                        setIsPlayingAudio(true);
                      }}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Listen Now</span>
                    </button>

                    <button
                      onClick={() => downloadNotes(sermon)}
                      className="text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Study Notes</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Sticky Audio Player Console */}
          {activeSermon && (
            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-4 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                  className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shrink-0 cursor-pointer"
                >
                  {isPlayingAudio ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                </button>
                <div>
                  <div className="text-xs font-bold text-white truncate max-w-xs sm:max-w-md">
                    {activeSermon.title}
                  </div>
                  <div className="text-[11px] text-slate-400">{activeSermon.speaker} · {activeSermon.duration}</div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="flex-1 max-w-md space-y-1">
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full transition-all" style={{ width: `${audioProgress}%` }} />
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>{elapsed}</span>
                  <span>{activeSermon.duration}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={copySermonLink}
                  className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Back to Home CTA */}
        <div className="text-center pt-4 pb-8">
          <button
            onClick={onNavigateHome}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer p-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Main Church Homepage</span>
          </button>
        </div>
      </div>
    </div>
  );
};
