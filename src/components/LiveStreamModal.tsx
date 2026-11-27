import React, { useState, useEffect, useRef } from 'react';
import { Send, Users, Heart, Sparkles } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import { api, errorMessage, type LiveChatMessage } from '../lib/api';
import { LiveStreamPlayer } from './LiveStreamPlayer';
import { useLiveStatus } from '../lib/liveStream';

interface LiveStreamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenGive: () => void;
  onOpenPrayer: () => void;
}

export const LiveStreamModal: React.FC<LiveStreamModalProps> = ({
  isOpen,
  onClose,
  onOpenGive,
  onOpenPrayer,
}) => {
  const liveStatus = useLiveStatus();
  const [activeTab, setActiveTab] = useState<'chat' | 'scripture' | 'notes'>('chat');
  const [chatInput, setChatInput] = useState('');
  const [chatError, setChatError] = useState('');
  const [chatOnline, setChatOnline] = useState<boolean | null>(null);
  const [amens, setAmens] = useState(0);
  const [messages, setMessages] = useState<LiveChatMessage[]>([]);

  const { content } = useContent();
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const lastChatIdRef = useRef<string | undefined>(undefined);
  const knownChatIdsRef = useRef<Set<string>>(new Set());

  const applyIncomingMessages = (incoming: LiveChatMessage[]) => {
    const fresh = incoming.filter((message) => !knownChatIdsRef.current.has(message.id));
    if (fresh.length === 0) return;
    fresh.forEach((message) => knownChatIdsRef.current.add(message.id));
    lastChatIdRef.current = fresh[fresh.length - 1]?.id;
    setMessages((previous) => [...previous, ...fresh]);
  };

  // Only poll while the modal is open so we never hit the API in the background.
  useEffect(() => {
    if (!isOpen) return undefined;
    let cancelled = false;

    const loadStats = async () => {
      try {
        const result = await api.liveStats();
        if (!cancelled) setAmens(result.data?.amens ?? 0);
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
  }, [isOpen]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) return null;

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = chatInput.trim();
    if (!text) return;

    const optimistic: LiveChatMessage = {
      id: `local-${Date.now()}`,
      sender: 'You',
      location: 'Online Viewer',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((previous) => [...previous, optimistic]);
    setChatInput('');
    setChatError('');

    try {
      const result = await api.postLiveChat({ sender: 'You', text, location: 'Online Viewer' });
      if (result.data) {
        knownChatIdsRef.current.add(result.data.id);
        setMessages((previous) =>
          previous.map((message) => (message.id === optimistic.id ? (result.data as LiveChatMessage) : message)),
        );
      }
      setChatOnline(true);
    } catch (cause) {
      setChatOnline(false);
      setChatError(errorMessage(cause));
    }
  };

  const handleAmen = async () => {
    setAmens((value) => value + 1);
    try {
      const result = await api.reactAmen();
      if (typeof result.data?.amens === 'number') setAmens(result.data.amens);
    } catch {
      /* keep the optimistic count */
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-950 border border-slate-800 rounded-3xl w-full max-w-6xl max-h-[96vh] flex flex-col overflow-hidden shadow-2xl relative text-slate-100">
        {/* Stream Top Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <span
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-bold uppercase tracking-wider ${
                liveStatus.isLive
                  ? 'bg-red-600/20 border-red-500/40 text-red-400'
                  : 'bg-slate-900 border-slate-700 text-slate-400'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  liveStatus.isLive ? 'bg-red-500 animate-pulse' : 'bg-slate-500'
                }`}
              />
              <span>{liveStatus.isLive ? 'Live Broadcast' : 'Between Services'}</span>
            </span>
            <div className="hidden sm:block">
              <h3 className="text-sm font-bold text-white">Sunday Global Encounter Service</h3>
              <p className="text-[11px] text-slate-400">Streaming from Sandton Apostolic Hub &amp; Campuses</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {liveStatus.isLive && liveStatus.viewers !== null && (
              <div className="flex items-center gap-1 text-xs text-slate-400 font-mono">
                <Users className="w-3.5 h-3.5 text-blue-400" />
                <span>{liveStatus.viewers.toLocaleString()} Viewers</span>
              </div>
            )}
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-850 cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Video Player + Interactive Sidebar Split */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden min-h-[480px]">
          {/* Main Video Viewport (8 Cols) */}
          <div className="lg:col-span-8 bg-slate-950 flex flex-col justify-between relative group">
            {/* Real YouTube Live embed (offline state between services) */}
            <div className="w-full h-full min-h-[300px] flex items-center justify-center overflow-hidden p-2 sm:p-3">
              <LiveStreamPlayer className="max-h-[52vh] lg:max-h-none rounded-xl" />
            </div>

            {/* Bottom Stream Bar */}
            <div className="p-3 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between gap-2 flex-wrap text-xs">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                {chatOnline === false
                  ? 'Offline mode — messages stay on this device'
                  : 'Fellowship chat connected'}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleAmen}
                  className="px-3 py-1 rounded-lg bg-red-600/80 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1 cursor-pointer transition-transform active:scale-105"
                >
                  <Heart className="w-3.5 h-3.5 fill-white" />
                  <span>Amen ({amens.toLocaleString()})</span>
                </button>
                <button
                  onClick={onOpenGive}
                  className="px-3 py-1 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40 text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Heart className="w-3.5 h-3.5 fill-amber-300" />
                  <span>Give Offering</span>
                </button>
                <button
                  onClick={onOpenPrayer}
                  className="px-3 py-1 rounded-lg bg-blue-600/20 text-blue-300 hover:bg-blue-600/30 border border-blue-500/40 text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-blue-300" />
                  <span>Live Prayer</span>
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Stream Sidebar: Chat, Scripture, Notes (4 Cols) */}
          <div className="lg:col-span-4 bg-slate-900 flex flex-col border-t lg:border-t-0 lg:border-l border-slate-800 h-full">
            {/* Sidebar Tabs */}
            <div className="flex items-center border-b border-slate-800 text-xs font-bold bg-slate-950">
              <button
                onClick={() => setActiveTab('chat')}
                className={`flex-1 py-3 text-center border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'chat'
                    ? 'border-blue-500 text-white bg-slate-900/50'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Live Fellowship Chat
              </button>
              <button
                onClick={() => setActiveTab('scripture')}
                className={`flex-1 py-3 text-center border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'scripture'
                    ? 'border-blue-500 text-white bg-slate-900/50'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Today’s Scripture
              </button>
              <button
                onClick={() => setActiveTab('notes')}
                className={`flex-1 py-3 text-center border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'notes'
                    ? 'border-blue-500 text-white bg-slate-900/50'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Sermon Notes
              </button>
            </div>

            {/* Tab 1: Live Chat Feed */}
            {activeTab === 'chat' && (
              <div className="flex-1 flex flex-col justify-between overflow-hidden">
                <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
                  {messages.length === 0 && (
                    <div className="rounded-xl border border-dashed border-slate-800 bg-slate-950/50 p-4 text-center text-[11px] leading-relaxed text-slate-500">
                      {chatOnline === false
                        ? 'Live chat needs the RCI server. Messages you send now stay on this device.'
                        : 'The altar is quiet. Be the first to share an Amen, a greeting or a testimony.'}
                    </div>
                  )}
                  {messages.map((m) => (
                    <div key={m.id} className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-blue-400">{m.sender}</span>
                        <div className="text-[10px] text-slate-500 flex items-center gap-1">
                          <span>{m.location}</span>
                          <span>·</span>
                          <span>{m.timestamp}</span>
                        </div>
                      </div>
                      <p className="text-slate-200 leading-relaxed">{m.text}</p>
                    </div>
                  ))}
                  <div ref={chatBottomRef} />
                </div>

                {/* Send Chat Form */}
                <form onSubmit={handleSendChat} className="p-3 border-t border-slate-800 bg-slate-950 flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Type an encouraging word..."
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center justify-center cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
                {chatError && (
                  <p className="px-3 pb-2 text-[11px] text-amber-400 bg-slate-950">{chatError}</p>
                )}
              </div>
            )}

            {/* Tab 2: Scripture Viewer */}
            {activeTab === 'scripture' && (
              <div className="flex-1 p-5 overflow-y-auto space-y-4 text-xs sm:text-sm">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="font-bold text-amber-400 text-xs uppercase tracking-wider">
                    Romans 8:31-32 (NKJV)
                  </div>
                  <p className="text-slate-200 leading-relaxed italic">
                    "What then shall we say to these things? If God is for us, who can be against us? He who did not spare His own Son, but delivered Him up for us all, how shall He not with Him also freely give us all things?"
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="font-bold text-amber-400 text-xs uppercase tracking-wider">
                    Matthew 6:10 (NKJV)
                  </div>
                  <p className="text-slate-200 leading-relaxed italic">
                    "Your kingdom come. Your will be done on earth as it is in heaven."
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="font-bold text-blue-400 text-xs uppercase tracking-wider">
                    Ephesians 1:19-20 (NKJV)
                  </div>
                  <p className="text-slate-200 leading-relaxed italic">
                    "...and what is the exceeding greatness of His power toward us who believe, according to the working of His mighty power which He worked in Christ when He raised Him from the dead and seated Him at His right hand in the heavenly places."
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'notes' && (
              <div className="flex-1 space-y-3 overflow-y-auto p-5 text-xs">
                {content.sermons[0] && (
                  <>
                    <p className="font-bold text-white">{content.sermons[0].title}</p>
                    <p className="text-[11px] text-slate-400">{content.sermons[0].scripture}</p>
                    <ul className="space-y-2">
                      {content.sermons[0].keyPoints.map((point) => (
                        <li key={point} className="rounded-xl border border-slate-800 bg-slate-950 p-3 leading-relaxed text-slate-200">
                          {point}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
