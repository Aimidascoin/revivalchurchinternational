import React, { useState } from 'react';
import { useContent } from '../context/ContentContext';
import { api, errorMessage } from '../lib/api';
import { useToast } from './Toast';
import {
  ChevronDown,
  ChevronUp,
  Heart,
  Flame,
  MapPin,
  Check,
  Send,
  Globe,
  ArrowLeft,
} from 'lucide-react';

interface ConnectPageProps {
  onNavigateHome: () => void;
  onOpenVisit: () => void;
  onOpenPrayer: () => void;
}

export const ConnectPage: React.FC<ConnectPageProps> = ({
  onNavigateHome,
  onOpenVisit,
  onOpenPrayer,
}) => {
  const [expandedFaithIdx, setExpandedFaithIdx] = useState<number | null>(0);
  const [groupSearch, setGroupSearch] = useState('');
  const [selectedDay, setSelectedDay] = useState('All');

  // Connect Card Form State
  const [visitorName, setVisitorName] = useState('');
  const [visitorEmail, setVisitorEmail] = useState('');
  const [visitorPhone, setVisitorPhone] = useState('');
  const [visitorCampus, setVisitorCampus] = useState('Johannesburg (HQ)');
  const [visitorInterest, setVisitorInterest] = useState('Joining a Revival Group');
  const [connectSuccess, setConnectSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { content } = useContent();
  const toast = useToast();

  const revivalGroupsList = [
    { name: 'Sandton & Bryanston Executive Hub', day: 'Wednesdays', time: '19:00 PM CAT', type: 'In-Person', leader: 'Deacon Mark & Sis Linda', suburb: 'Sandton, JHB' },
    { name: 'Fourways & Midrand Family Fellowship', day: 'Thursdays', time: '19:30 PM CAT', type: 'In-Person', leader: 'Bro Thabo & Sis Zanele', suburb: 'Fourways, JHB' },
    { name: 'Century City Young Professionals', day: 'Tuesdays', time: '19:00 PM CAT', type: 'In-Person', leader: 'Elder Kevin & Sarah', suburb: 'Cape Town' },
    { name: 'Ballito Coastal Prayer Altar', day: 'Thursdays', time: '18:30 PM CAT', type: 'In-Person', leader: 'Pastors Michael & Deborah', suburb: 'Ballito, KZN' },
    { name: 'UK & Europe Virtual Zoom eGroup', day: 'Thursdays', time: '19:30 PM GMT', type: 'Online Zoom', leader: 'Pastor Emmanuel', suburb: 'London & Global' },
    { name: 'North America East Coast eGroup', day: 'Wednesdays', time: '20:00 PM EST', type: 'Online Zoom', leader: 'Pastor Marcus', suburb: 'Atlanta & USA' },
  ];

  const filteredGroups = revivalGroupsList.filter((g) => {
    const matchesSearch = g.name.toLowerCase().includes(groupSearch.toLowerCase()) || g.suburb.toLowerCase().includes(groupSearch.toLowerCase());
    const matchesDay = selectedDay === 'All' || g.day.includes(selectedDay);
    return matchesSearch && matchesDay;
  });

  const handleConnectCardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setError('');
    setSubmitting(true);
    try {
      await api.contact({
        name: visitorName,
        email: visitorEmail,
        subject: `Connect Card — ${visitorInterest} (${visitorCampus})`,
        message: `Phone: ${visitorPhone || 'not provided'}. I would like to connect through: ${visitorInterest}.`,
      });
      setConnectSuccess(true);
      toast('Your connect card has been received.');
      window.setTimeout(() => {
        setConnectSuccess(false);
        setVisitorName('');
        setVisitorEmail('');
        setVisitorPhone('');
      }, 4000);
    } catch (cause) {
      const message = errorMessage(cause);
      setError(message);
      toast(message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-16">
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
            <span className="text-slate-200 font-medium">Connect · About &amp; Groups</span>
          </div>

          <button
            onClick={onNavigateHome}
            className="self-start sm:self-auto px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </button>
        </div>

        {/* 1. Meet the Team / Senior Leaders */}
        <section id="leadership" className="space-y-8 scroll-mt-24">
          <div className="text-center max-w-3xl mx-auto">
            <div className="text-xs font-semibold tracking-wider uppercase text-blue-400 mb-2">
              SENIOR LEADERS
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Meet the Leadership Team
            </h2>
            <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed">
              Led by Prophet Herbert &amp; Pastor Shelma Mulondo
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6">
                <div className="rounded-2xl overflow-hidden border border-slate-700/80 aspect-[3/2] bg-slate-950 relative shadow-2xl">
                  <img
                    src="assets/aistudio/_DSC0321_104091fc.JPG"
                    alt="Prophet Herbert & Pastor Shelma Mulondo"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top brightness-[1.04] contrast-[1.06] saturate-[1.05]"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                      Senior Leaders &amp; Founders
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-white drop-shadow">
                      Prophet Herbert &amp; Pastor Shelma Mulondo
                    </h3>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 space-y-4">
                <span className="px-3 py-1 rounded-full bg-blue-600/10 border border-blue-500/30 text-blue-400 text-xs font-bold font-mono">
                  Senior Leaders &amp; Visionaries
                </span>
                <h3 className="text-2xl font-extrabold text-white">
                  Carrying an Uncompromising Message of Grace &amp; Revival Fire
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  For over two decades, Prophet Herbert Mulondo has preached the uncompromised gospel of Jesus Christ accompanied by notable miracles, healing, and prophetic breakthroughs across the nations.
                </p>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  Pastor Shelma Mulondo ministers alongside him, nurturing covenant families, Queen Reigning Women’s fellowship, and compassionate care initiatives that serve God’s people with excellence and love.
                </p>

                <div className="pt-2 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-slate-300">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <div className="font-bold text-white">Apostolic Council</div>
                    <div className="text-[11px] text-slate-400">12 Ordained Elders</div>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <div className="font-bold text-white">Campus Pastors</div>
                    <div className="text-[11px] text-slate-400">5 Regional Assemblies</div>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <div className="font-bold text-white">eGroup Shepherds</div>
                    <div className="text-[11px] text-slate-400">120+ Cell Leaders</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. About RCI: Supernatural Church · Changing Lives · Disciple the Nations */}
        <section id="about" className="space-y-8 scroll-mt-24">
          <div className="text-center max-w-3xl mx-auto">
            <div className="text-xs font-semibold tracking-wider uppercase text-blue-400 mb-2">
              Supernatural Church · Changing Lives · Disciple the Nations
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              About Revival Church International
            </h2>
            <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed">
              We are a supernatural church committed to seeing lives transformed by the living Word and discipling the nations through the love and power of Jesus Christ.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold">
                <Flame className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Supernatural Church</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                A house filled with the tangible presence of the Holy Spirit—marked by prophetic ministry, healing, miracles, and the uncompromised demonstration of God’s power.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Changing Lives</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                The place where your story changes, where the Word works, and where believers are loved, restored, and cared for as one covenant family that always comes back with a testimony.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center font-bold">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Disciple the Nations</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                From our Sandton headquarters in Johannesburg to physical campuses across South Africa and abroad, we raise grounded disciples, mentor kingdom leaders, and carry revival across communities and nations.
              </p>
            </div>
          </div>
        </section>

        {/* 3. Statement of Faith (What We Believe) */}
        <section id="faith" className="space-y-8 scroll-mt-24">
          <div className="text-center max-w-3xl mx-auto">
            <div className="text-xs font-semibold tracking-wider uppercase text-blue-400 mb-2">
              Doctrinal Foundation
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Statement of Faith &amp; Core Truths
            </h2>
            <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed">
              We stand unapologetically on the infallible Word of God and the finished work of Jesus Christ on Calvary.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {content.statementOfFaith.map((item, idx) => {
                const isExpanded = expandedFaithIdx === idx;
                return (
                  <div
                    key={idx}
                    className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 transition-all"
                  >
                    <button
                      onClick={() => setExpandedFaithIdx(isExpanded ? null : idx)}
                      className="w-full flex items-center justify-between text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-full bg-blue-600/20 text-blue-400 font-mono text-xs font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="text-sm font-bold text-white">
                          {item.title}
                        </span>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </button>
                    {isExpanded && (
                      <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed pl-8 animate-in fade-in duration-200">
                        {item.summary}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 4. Revival Groups Directory & Finder */}
        <section id="groups" className="space-y-8 scroll-mt-24">
          <div className="text-center max-w-3xl mx-auto">
            <div className="text-xs font-semibold tracking-wider uppercase text-amber-400 mb-2">
              Mid-Week Fellowship &amp; Life Together
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Revival Groups (In-Person &amp; Virtual eGroups)
            </h2>
            <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed">
              This is where church really happens. Small enough to know your name, big enough to change your life. Meet weekly in living rooms and on Zoom.
            </p>
          </div>

          {/* Group Search & Filter */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <div className="w-full sm:w-72">
              <input
                type="text"
                value={groupSearch}
                onChange={(e) => setGroupSearch(e.target.value)}
                placeholder="Search suburb or campus..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto text-xs">
              <span className="text-slate-400 shrink-0">Filter Day:</span>
              {['All', 'Tuesdays', 'Wednesdays', 'Thursdays'].map((day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                    selectedDay === day
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          {/* Groups Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGroups.map((group, idx) => (
              <div
                key={idx}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 hover:border-blue-500/50 transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-mono text-[11px] font-bold">
                      {group.type}
                    </span>
                    <span className="text-xs text-amber-400 font-bold">{group.day}</span>
                  </div>
                  <h4 className="text-base font-bold text-white">{group.name}</h4>
                  <p className="text-xs text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>{group.suburb} · {group.time}</span>
                  </p>
                  <p className="text-xs text-slate-400">Led by {group.leader}</p>
                </div>

                <div className="pt-3 border-t border-slate-800">
                  <a
                    href="#connect-card"
                    className="w-full text-center py-2 px-3 rounded-xl bg-slate-950 hover:bg-blue-600 text-slate-200 hover:text-white text-xs font-bold block transition-colors"
                  >
                    Join this Group
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. First-Time Guest Connect Card Form */}
        <section id="connect-card" className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-12 shadow-2xl">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <span className="text-xs font-mono font-bold uppercase text-blue-400">First-Time Guest or Interested in a Group?</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                Submit Your Digital Connect Card
              </h3>
              <p className="text-xs sm:text-sm text-slate-400">
                Let us know how we can serve you. Our pastoral hosts will reach out with a personal welcome and group placement details.
              </p>
            </div>

            {connectSuccess ? (
              <div className="p-8 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-3 animate-in fade-in">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-white">Connect Card Received!</h4>
                <p className="text-xs sm:text-sm text-slate-300">
                  Welcome to the family, <strong className="text-white">{visitorName}</strong>. Our host team has received your submission and will be in touch shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleConnectCardSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={visitorName}
                      onChange={(e) => setVisitorName(e.target.value)}
                      placeholder="e.g. Sipho Moyo"
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={visitorEmail}
                      onChange={(e) => setVisitorEmail(e.target.value)}
                      placeholder="sipho@domain.com"
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Phone / WhatsApp</label>
                    <input
                      type="tel"
                      value={visitorPhone}
                      onChange={(e) => setVisitorPhone(e.target.value)}
                      placeholder="+27 (0) 83 000 0000"
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Closest Campus</label>
                    <select
                      value={visitorCampus}
                      onChange={(e) => setVisitorCampus(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="Johannesburg (HQ)">Johannesburg (Sandton HQ)</option>
                      <option value="Cape Town Campus">Cape Town Campus</option>
                      <option value="Dolphin Coast (Ballito)">Dolphin Coast (Ballito)</option>
                      <option value="London UK Campus">London UK Campus</option>
                      <option value="Atlanta USA Campus">Atlanta USA Campus</option>
                      <option value="Global Online Campus">Global Online Campus</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">I would like to:</label>
                  <select
                    value={visitorInterest}
                    onChange={(e) => setVisitorInterest(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Joining a Revival Group">Join a Revival Group (In-Person or Zoom)</option>
                    <option value="Connect with a Pastor">Schedule a chat with a Pastor</option>
                    <option value="Water Baptism">Learn more about Water Baptism</option>
                    <option value="Just Visiting">I am a First-Time Guest</option>
                  </select>
                </div>

                {error && (
                  <p role="alert" className="rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs sm:text-sm shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-60"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Sending…' : 'Send My Connect Card'}</span>
                </button>
              </form>
            )}
          </div>
        </section>

        {/* Back to Home CTA */}
        <div className="flex flex-col items-center gap-3 pt-4 pb-8">
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={onOpenPrayer}
              className="inline-flex items-center gap-2 rounded-xl border border-blue-500/40 bg-blue-600/10 px-4 py-2.5 text-xs font-bold text-blue-300 hover:bg-blue-600/20 transition-colors cursor-pointer"
            >
              <Heart className="h-3.5 w-3.5" />
              <span>Need Prayer? Send a Request</span>
            </button>
            <button
              onClick={onOpenVisit}
              className="inline-flex items-center gap-2 rounded-xl border border-amber-400/40 bg-amber-400/10 px-4 py-2.5 text-xs font-bold text-amber-300 hover:bg-amber-400/20 transition-colors cursor-pointer"
            >
              <MapPin className="h-3.5 w-3.5" />
              <span>Plan Your Visit</span>
            </button>
          </div>
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
