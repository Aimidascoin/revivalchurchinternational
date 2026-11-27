import React, { useState } from 'react';
import { Quote, Sparkles, Check, Send } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import { api, errorMessage } from '../lib/api';
import { useToast } from './Toast';

export const TestimoniesSection: React.FC = () => {
  const [showShareModal, setShowShareModal] = useState(false);
  const [authorName, setAuthorName] = useState('');
  const [authorCity, setAuthorCity] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [authorStory, setAuthorStory] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { content } = useContent();
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setError('');
    setSubmitting(true);
    try {
      await api.contact({
        name: authorName,
        email: authorEmail,
        subject: `Testimony from ${authorCity || 'an RCI member'}`,
        message: authorStory,
      });
      setSubmitted(true);
      toast('Thank you for sharing your testimony.');
      window.setTimeout(() => {
        setSubmitted(false);
        setShowShareModal(false);
        setAuthorName('');
        setAuthorCity('');
        setAuthorEmail('');
        setAuthorStory('');
      }, 2500);
    } catch (cause) {
      const message = errorMessage(cause);
      setError(message);
      toast(message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-20 bg-slate-950 relative overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <div className="text-xs font-semibold tracking-wider uppercase text-blue-400 mb-2">
              Supernatural Evidence
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Testimonies of Jesus Christ
            </h2>
            <p className="mt-2 text-slate-300 text-sm sm:text-base max-w-xl">
              "And they overcame him by the blood of the Lamb and by the word of their testimony." — Revelation 12:11
            </p>
          </div>

          <button
            onClick={() => setShowShareModal(true)}
            className="self-start sm:self-auto px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-xl transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Share What God Has Done</span>
          </button>
        </div>

        {/* Testimonies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {content.testimonies.map((t) => (
            <div
              key={t.id}
              className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-7 flex flex-col justify-between hover:border-slate-700 transition-all shadow-md relative"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-900">
                    {t.category}
                  </span>
                  <span className="text-xs text-slate-400">{t.date}</span>
                </div>

                <Quote className="w-8 h-8 text-blue-500/20 mb-2" />

                <h4 className="text-base font-bold text-white mb-2 leading-snug">
                  "{t.title}"
                </h4>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                  {t.story}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800">
                <div className="text-xs font-bold text-white">{t.name}</div>
                <div className="text-[11px] text-slate-400">{t.city}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Share Testimony Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-md p-6 sm:p-8 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div>
                <h3 className="text-lg font-bold text-white">Share Your Testimony</h3>
                <p className="text-xs text-slate-400">Give God the glory for what He has done</p>
              </div>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-900 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {submitted ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-white">Glory to God!</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Thank you for submitting your testimony. Our pastoral team rejoices with you and will review it for upcoming service praise reports.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="e.g. David M."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    City / Campus
                  </label>
                  <input
                    type="text"
                    required
                    value={authorCity}
                    onChange={(e) => setAuthorCity(e.target.value)}
                    placeholder="e.g. Johannesburg or London"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={authorEmail}
                    onChange={(e) => setAuthorEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Your Story
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={authorStory}
                    onChange={(e) => setAuthorStory(e.target.value)}
                    placeholder="Describe the miracle, healing, deliverance, or breakthrough God did in your life..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {error && (
                  <p role="alert" className="rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300">{error}</p>
                )}

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowShareModal(false)}
                    className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-md shadow-blue-600/30 flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{submitting ? 'Sending…' : 'Submit Testimony'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
