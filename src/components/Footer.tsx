import React, { useState } from 'react';
import { Mail, Phone, MapPin, Heart, Smartphone, Sparkles, Check } from 'lucide-react';
import type { AppPage } from './Navbar';
import { useContent } from '../context/ContentContext';
import { api, errorMessage } from '../lib/api';
import { useToast } from './Toast';

interface FooterProps {
  onNavigate: (page: AppPage) => void;
  onOpenGive: () => void;
  onOpenPrayer: () => void;
  onOpenVisit: () => void;
  onOpenDownload: () => void;
}

type InfoPanel = 'privacy' | 'terms' | 'app';

const panels: Record<InfoPanel, { title: string; intro: string; points: string[] }> = {
  privacy: {
    title: 'Privacy Policy',
    intro: 'Revival Church International respects your privacy. Information you share through this website is used only to respond to your request.',
    points: [
      'We collect only the details you submit in our prayer, visit, giving and contact forms.',
      'Your information is stored on our secured server and is never sold or shared with advertisers.',
      'Confidential prayer requests are visible only to the pastoral prayer team.',
      'To request access or deletion of your details, email info@revivalchurchintl.org.',
    ],
  },
  terms: {
    title: 'Terms of Use',
    intro: 'By using this website you agree to the following terms.',
    points: [
      'All content, media and broadcasts are the property of Revival Church International.',
      'Sermon notes and resources may be downloaded for personal, non-commercial use.',
      'Giving pledges recorded here are commitments; no payment is processed on this website.',
      'We may update service times and event details as needed; the latest information is always published here.',
    ],
  },
  app: {
    title: 'RCI Mobile App',
    intro: 'The RCI app brings sermons, event registration, giving and your revival group to your phone.',
    points: [
      'The app is being prepared for Apple App Store and Google Play release.',
      'Subscribe to our weekly bulletin below to hear when the app launches.',
      'In the meantime, all sermons, campus details and resources are available on this website.',
    ],
  },
};

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenGive,
  onOpenPrayer,
  onOpenVisit,
  onOpenDownload,
}) => {
  const { content } = useContent();
  const toast = useToast();
  const [emailSub, setEmailSub] = useState('');
  const [subDone, setSubDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [panel, setPanel] = useState<InfoPanel | null>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setError('');
    setSubmitting(true);
    try {
      const response = await api.newsletter(emailSub);
      setSubDone(true);
      toast(response.message ?? 'You have joined the prayer newsletter.');
      setEmailSub('');
      window.setTimeout(() => setSubDone(false), 4000);
    } catch (cause) {
      const message = errorMessage(cause);
      setError(message);
      toast(message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const navLinks: Array<{ label: string; page: AppPage }> = [
    { label: 'About Leadership & History', page: 'connect' },
    { label: 'Ministries & Vanguard Men', page: 'ministries' },
    { label: 'Sermon Library & Podcasts', page: 'watch' },
    { label: 'Discipleship Pathway 101', page: 'membership' },
    { label: 'Conferences & Events', page: 'home' },
  ];

  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-xs text-slate-400 sm:text-sm">
      <div className="border-b border-slate-800 bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
          <div>
            <h3 className="text-xl font-bold text-white sm:text-2xl">Stay Rooted in the Word &amp; Prophetic Bulletins</h3>
            <p className="mt-1 text-xs text-slate-300 sm:text-sm">
              Receive weekly devotionals, conference alerts, and leadership insights directly to your inbox.
            </p>
          </div>
          <form onSubmit={handleSubscribe} className="flex w-full gap-2 md:w-auto">
            <input
              type="email"
              required
              value={emailSub}
              onChange={(e) => setEmailSub(e.target.value)}
              placeholder="Enter your email address..."
              className="w-full rounded-xl border border-slate-700/80 bg-slate-900 px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:w-72"
            />
            <button
              type="submit"
              disabled={submitting}
              className="whitespace-nowrap rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-blue-500 disabled:opacity-60"
            >
              {submitting ? 'Joining…' : subDone ? 'Subscribed!' : 'Subscribe'}
            </button>
          </form>
        </div>
        {error && <p role="alert" className="mx-auto mt-3 max-w-7xl text-xs text-red-300">{error}</p>}
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="space-y-4 lg:col-span-2">
            <button onClick={() => onNavigate('home')} className="flex items-center gap-2 text-white">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold">RCI</div>
              <span className="text-lg font-bold tracking-tight">Revival Church International</span>
            </button>
            <p className="max-w-sm text-xs leading-relaxed text-slate-400">
              An apostolic house built upon grace, supernatural power, and family. Reaching the nations with the gospel of Jesus Christ through thriving regional campuses and global broadcasts.
            </p>
            <div className="space-y-1.5 pt-2 text-xs">
              <div className="flex items-center gap-2 text-slate-300"><Phone className="h-3.5 w-3.5 text-blue-400" /><span>Global Pastoral Desk: +27 (0) 11 884 9200</span></div>
              <div className="flex items-center gap-2 text-slate-300"><Mail className="h-3.5 w-3.5 text-blue-400" /><span>info@revivalchurchintl.org</span></div>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button onClick={onOpenGive} className="flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-400 hover:bg-amber-500/20">
                <Heart className="h-3 w-3" /> Give / Tithe
              </button>
              <button onClick={onOpenPrayer} className="flex items-center gap-1.5 rounded-lg border border-blue-600/30 bg-blue-600/10 px-3 py-1.5 text-xs font-semibold text-blue-400 hover:bg-blue-600/20">
                <Sparkles className="h-3 w-3 text-amber-400" /> Request Prayer
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Quick Links</h4>
            <ul className="space-y-2 text-xs">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <button onClick={() => onNavigate(link.page)} className="text-left hover:text-white">{link.label}</button>
                </li>
              ))}
              <li><button onClick={onOpenVisit} className="text-left hover:text-white">Plan Your Sunday Visit</button></li>
              <li>
                <button onClick={onOpenDownload} className="flex items-center gap-1 text-left font-semibold text-blue-400 hover:text-blue-300">
                  📥 Free Downloads &amp; Guides
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Campuses &amp; Gatherings</h4>
            <ul className="space-y-2 text-xs">
              {content.campuses.map((campus) => (
                <li key={campus.id}>
                  <button onClick={() => onNavigate('campuses')} className="flex items-center gap-1.5 hover:text-white">
                    <MapPin className="h-3 w-3 shrink-0 text-blue-400" />
                    {campus.name.split(' (')[0]}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Download the RCI App</h4>
            <p className="text-xs leading-relaxed text-slate-400">
              Register for events, access offline audio sermons, give securely, and connect with your eGroup.
            </p>
            <button
              onClick={() => setPanel('app')}
              className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900 p-2.5 text-slate-200 transition-colors hover:bg-slate-800"
            >
              <Smartphone className="h-5 w-5 text-blue-400" />
              <div className="text-left">
                <div className="text-[10px] uppercase leading-none text-slate-400">Coming to</div>
                <div className="text-xs font-bold leading-tight">Apple &amp; Android</div>
              </div>
            </button>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-900 pt-10 text-xs text-slate-500 sm:flex-row">
          <div>© 2026 Revival Church International (RCI). All Rights Reserved. Non-Profit Organization.</div>
          <div className="flex items-center gap-4">
            <button onClick={() => setPanel('privacy')} className="hover:text-slate-300">Privacy Policy</button>
            <span aria-hidden="true">·</span>
            <button onClick={() => setPanel('terms')} className="hover:text-slate-300">Terms of Use</button>
            <span aria-hidden="true">·</span>
            <span>Sandton · Cape Town · London · Atlanta</span>
          </div>
        </div>
      </div>

      {panel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-2xl sm:p-8">
            <div className="mb-4 flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white">{panels[panel].title}</h3>
              <button onClick={() => setPanel(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <p className="text-xs leading-relaxed text-slate-300">{panels[panel].intro}</p>
            <ul className="mt-4 space-y-2">
              {panels[panel].points.map((point) => (
                <li key={point} className="flex gap-2 text-xs leading-relaxed text-slate-400">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-400" /> {point}
                </li>
              ))}
            </ul>
            <button onClick={() => setPanel(null)} className="mt-6 w-full rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white hover:bg-blue-500">Close</button>
          </div>
        </div>
      )}
    </footer>
  );
};
