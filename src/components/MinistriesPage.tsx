import React, { useState } from 'react';
import { useContent } from '../context/ContentContext';
import { api, errorMessage } from '../lib/api';
import { useToast } from './Toast';

import {
  Users,
  Heart,
  Check,
  ArrowRight,
  ArrowLeft,
  Send,
  Play,
} from 'lucide-react';

const youthImg = 'images/rci_youth_revival_1790800226600.jpg';

interface MinistriesPageProps {
  onNavigateHome: () => void;
  onOpenVisit: () => void;
  onOpenPrayer: () => void;
}

export const MinistriesPage: React.FC<MinistriesPageProps> = ({
  onNavigateHome,
  onOpenVisit,
  onOpenPrayer,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [volunteerName, setVolunteerName] = useState('');
  const [volunteerEmail, setVolunteerEmail] = useState('');
  const [volunteerPhone, setVolunteerPhone] = useState('');
  const [volunteerMinistry, setVolunteerMinistry] = useState('Unstoppablegenr (Youth & Young adults)');
  const [volunteerCampus, setVolunteerCampus] = useState('Paarl');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { content } = useContent();
  const toast = useToast();

  const categories = [
    'All',
    'Youth',
    'Worship',
    'Women',
    'Men',
    'Children',
    'Bible School',
    'Compassion',
    'Media',
    'Usher',
  ];

  const filteredMinistries = selectedCategory === 'All'
    ? content.ministries
    : content.ministries.filter((m) =>
        m.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        m.title.toLowerCase().includes(selectedCategory.toLowerCase())
      );

  const handleVolunteerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setError('');
    setSubmitting(true);
    try {
      await api.contact({
        name: volunteerName,
        email: volunteerEmail,
        subject: `Ministry Placement — ${volunteerMinistry} (${volunteerCampus})`,
        message: `Phone: ${volunteerPhone || 'not provided'}. I would like to serve in ${volunteerMinistry}.`,
      });
      setIsSubmitted(true);
      toast('Your ministry application has been received.');
      window.setTimeout(() => {
        setIsSubmitted(false);
        setVolunteerName('');
        setVolunteerEmail('');
        setVolunteerPhone('');
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
      <div className="max-w-7xl mx-auto space-y-14">
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
            <span className="text-slate-200 font-medium">Ministries · All Ages &amp; Callings</span>
          </div>

          <button
            onClick={onNavigateHome}
            className="self-start sm:self-auto px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </button>
        </div>

        {/* Hero Banner */}
        <div className="relative rounded-3xl bg-gradient-to-br from-blue-950 via-slate-900 to-slate-950 border border-slate-800 p-8 sm:p-14 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 font-mono text-xs font-bold">
              <Users className="w-3.5 h-3.5 text-blue-400" />
              Specialized Community Ministries
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              A Home for Every Generation
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              At Revival Church International, you are never lost in the crowd. Our specialized ministries foster authentic relationships, intentional mentorship, and deep spiritual growth for men, women, youth, children, and creatives.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href="#ministry-directory"
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-600/30 transition-all"
              >
                Browse Ministries
              </a>
              <a
                href="#volunteer"
                className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs sm:text-sm border border-slate-700 transition-all"
              >
                Join a Serving Team
              </a>
            </div>
          </div>
        </div>

        {/* Featured Spotlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Spotlight 1: Unstoppablegenr Movement */}
          <div className="rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 flex flex-col justify-between group shadow-xl">
            <div className="relative aspect-video sm:aspect-[16/9] overflow-hidden">
              <img
                src={youthImg}
                alt="Unstoppablegenr youth revival gathering"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-blue-600 text-white">
                  Ages 13–25
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white mt-1.5">
                  Unstoppablegenr
                </h3>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Raising an unashamed generation of kingdom leaders across high schools, universities, and creative sectors. Weekly Friday Night Fire rallies with live band, unscripted worship, and bold prophetic preaching.
              </p>
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 border-t border-slate-800/80 pt-3">
                <span className="text-blue-400 font-bold">Fridays @ 18:30 PM CAT</span>
                <div className="flex items-center gap-2">
                  <a
                    href="#sermons"
                    className="px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 hover:text-white font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-blue-500/30"
                  >
                    <Play className="w-3 h-3 fill-blue-300" />
                    <span>Video Sermons</span>
                  </a>
                  <a href="#volunteer" className="text-white hover:text-blue-300 flex items-center gap-1 font-bold">
                    <span>Connect with Unstoppablegenr</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Spotlight 2: Revival Kidz */}
          <div className="rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 flex flex-col justify-between group shadow-xl">
            <div className="relative aspect-video sm:aspect-[16/9] overflow-hidden bg-slate-950 flex items-center justify-center p-8">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto text-2xl font-black">
                  RK
                </div>
                <h3 className="text-2xl font-bold text-white">Revival Kidz Church</h3>
                <span className="text-xs font-mono text-amber-400 font-bold">Ages 1 to 12 Years</span>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Clean, safe, age-tailored environments where children experience God's love through energetic worship, illustrated Bible stories, memory verses, and creative activities. Background-checked security team on duty at all times.
              </p>
              <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-3">
                <span className="text-amber-400 font-bold">During Every Sunday Service</span>
                <button onClick={onOpenVisit} className="text-white hover:text-amber-300 flex items-center gap-1 font-bold cursor-pointer">
                  <span>Pre-Register Children</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <section id="ministry-directory" className="space-y-6 scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono font-bold uppercase text-blue-400">All Departments</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Ministry Directory
              </h2>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors cursor-pointer border ${
                    selectedCategory === cat
                      ? 'bg-blue-600 border-blue-500 text-white'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Ministries Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMinistries.map((ministry) => (
              <div
                key={ministry.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 hover:border-blue-500/50 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded bg-blue-500/10 text-blue-400 font-mono text-[11px] font-bold">
                      {ministry.category}
                    </span>
                    <span className="text-xs text-slate-400">{ministry.tagline}</span>
                  </div>

                  <h3 className="text-xl font-bold text-white">{ministry.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {ministry.description}
                  </p>

                  <div className="space-y-1.5 pt-2 border-t border-slate-800 text-xs">
                    <div className="text-slate-400">Led by: <strong className="text-white">{ministry.leader}</strong></div>
                    <div className="text-slate-400">Focus: <span className="text-amber-400">{ministry.meetingTime}</span></div>
                  </div>

                  {ministry.badges && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {ministry.badges.map((b, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-slate-950 text-slate-400 text-[10px] border border-slate-800">
                          {b}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-800">
                  <a
                    href="#volunteer"
                    className="w-full text-center py-2.5 px-3 rounded-xl bg-slate-950 hover:bg-blue-600 text-slate-200 hover:text-white text-xs font-bold block transition-colors"
                  >
                    Connect with this Ministry
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Volunteer & Ministry Placement Form */}
        <section id="volunteer" className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-12 shadow-2xl scroll-mt-24">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <span className="text-xs font-mono font-bold uppercase text-blue-400">Deploy Your Spiritual Gifts</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                Apply for Ministry Placement
              </h3>
              <p className="text-xs sm:text-sm text-slate-400">
                God has invested gifts, talents, and anointing in you. Join an active ministry department and make an eternal impact.
              </p>
            </div>

            {isSubmitted ? (
              <div className="p-8 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-3 animate-in fade-in">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-white">Application Received!</h4>
                <p className="text-xs sm:text-sm text-slate-300">
                  Thank you, <strong className="text-white">{volunteerName}</strong>. The director for <strong className="text-blue-400">{volunteerMinistry}</strong> will contact you regarding your orientation and placement.
                </p>
              </div>
            ) : (
              <form onSubmit={handleVolunteerSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={volunteerName}
                      onChange={(e) => setVolunteerName(e.target.value)}
                      placeholder="e.g. Tendai Chikore"
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={volunteerEmail}
                      onChange={(e) => setVolunteerEmail(e.target.value)}
                      placeholder="john@domain.com"
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Mobile / WhatsApp</label>
                    <input
                      type="tel"
                      value={volunteerPhone}
                      onChange={(e) => setVolunteerPhone(e.target.value)}
                      placeholder="+27 (0) 84 000 0000"
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Campus</label>
                    <select
                      value={volunteerCampus}
                      onChange={(e) => setVolunteerCampus(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="Paarl">Paarl (Western Cape)</option>
                      <option value="Cape Town Campus">Cape Town Campus</option>
                      <option value="Dolphin Coast (Ballito)">Dolphin Coast (Ballito)</option>
                      <option value="London UK Campus">London UK Campus</option>
                      <option value="Atlanta USA Campus">Atlanta USA Campus</option>
                      <option value="Global Online Campus">Global Online Campus</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Ministry of Interest</label>
                  <select
                    value={volunteerMinistry}
                    onChange={(e) => setVolunteerMinistry(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Unstoppablegenr">Unstoppablegenr (Youth &amp; Campus Movement)</option>
                    <option value="Usher Ministry">Usher Ministry</option>
                    <option value="Revival Worship Ministry">Revival Worship Ministry</option>
                    <option value="Queen Reigning Women's Ministry">Queen Reigning Women's Ministry</option>
                    <option value="Children Church Ministry">Children Church Ministry</option>
                    <option value="Supernatural Bible School">Supernatural Bible School</option>
                    <option value="Herbert Mulondo Compassion Foundation">Herbert Mulondo Compassion Foundation</option>
                    <option value="Dorcas Ministry">Dorcas Ministry</option>
                    <option value="Revival Groups">Revival Groups</option>
                    <option value="Media & Video Ministry">Media &amp; Video Ministry</option>
                    <option value="Knight Men Ministry">Knight Men Ministry</option>
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
                  <span>{submitting ? 'Sending…' : 'Submit Ministry Application'}</span>
                </button>
              </form>
            )}
          </div>
        </section>

        {/* Back to Home CTA */}
        <div className="flex flex-col items-center gap-3 pt-4 pb-8">
          <button
            onClick={onOpenPrayer}
            className="inline-flex items-center gap-2 rounded-xl border border-blue-500/40 bg-blue-600/10 px-4 py-2.5 text-xs font-bold text-blue-300 hover:bg-blue-600/20 transition-colors cursor-pointer"
          >
            <Heart className="h-3.5 w-3.5" />
            <span>Ask for Prayer as You Serve</span>
          </button>
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
