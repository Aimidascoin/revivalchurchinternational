import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Send, Users, Heart, Sparkles, Volume2, VolumeX, Radio } from 'lucide-react';
import { useContent } from '../context/ContentContext';
const heroImg = '/images/hero_revival_worship_1790800192961.jpg';

interface LiveStreamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenGive: () => void;
  onOpenPrayer: () => void;
}

interface ChatMessage {
  id: string;
  sender: string;
  location: string;
  text: string;
  timestamp: string;
}

export const LiveStreamModal: React.FC<LiveStreamModalProps> = ({
  isOpen,
  onClose,
  onOpenGive,
  onOpenPrayer,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'scripture' | 'notes'>('chat');
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', sender: 'Sister Rachel', location: 'London, UK', text: 'Amen! Tuning in with our family in London! The presence of God is here! 🔥', timestamp: '10:02' },
    { id: '2', sender: 'Pastor Andrew', location: 'Cape Town, SA', text: 'Fire on the altar! Welcome all watching from across the globe.', timestamp: '10:03' },
    { id: '3', sender: 'Brother Michael', location: 'Atlanta, USA', text: 'Watching live from Georgia. Ready for the Word today!', timestamp: '10:04' },
    { id: '4', sender: 'Thando M.', location: 'Johannesburg, SA', text: 'Hallelujah! The sound of worship is shifting atmospheres right now 🙌', timestamp: '10:05' },
    { id: '5', sender: 'Grace K.', location: 'Nairobi, Kenya', text: 'Connecting our faith for healing and breakthrough today in Jesus name!', timestamp: '10:06' },
  ]);

  const { content } = useContent();
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) return null;

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'You',
      location: 'Online Viewer',
      text: chatInput.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, newMsg]);
    setChatInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-950 border border-slate-800 rounded-3xl w-full max-w-6xl max-h-[96vh] flex flex-col overflow-hidden shadow-2xl relative text-slate-100">
        {/* Stream Top Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-600/20 border border-red-500/40 text-red-400 text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span>LIVE BROADCAST</span>
            </span>
            <div className="hidden sm:block">
              <h3 className="text-sm font-bold text-white">Sunday Global Encounter Service</h3>
              <p className="text-[11px] text-slate-400">Streaming from Sandton Apostolic Hub &amp; Campuses</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-xs text-slate-400 font-mono">
              <Users className="w-3.5 h-3.5 text-blue-400" />
              <span>4,820 Viewers</span>
            </div>
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
          <div className="lg:col-span-8 bg-black flex flex-col justify-between relative group">
            {/* Simulated Live Stream Feed */}
            <div className="relative w-full h-full min-h-[300px] flex items-center justify-center overflow-hidden">
              <img
                src={heroImg}
                alt="RCI Live Broadcast worship auditorium"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover filter brightness-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

              {/* Center Watermark & Status */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-6 text-center">
                <div className="w-14 h-14 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-2xl mb-3">
                  <Radio className="w-7 h-7 animate-pulse" />
                </div>
                <div className="text-xl sm:text-2xl font-bold text-white drop-shadow">
                  Revival Church International Broadcast
                </div>
                <div className="text-xs sm:text-sm text-slate-300 drop-shadow mt-1">
                  Prophet Herbert Mulondo ministering on Kingdom Authority
                </div>
              </div>
            </div>

            {/* Bottom Stream Bar */}
            <div className="p-3 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="hover:text-blue-400 cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="hover:text-blue-400 cursor-pointer"
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <span className="font-mono text-red-400 font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                  <span>1080p HD LIVE</span>
                </span>
              </div>

              <div className="flex items-center gap-2">
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
