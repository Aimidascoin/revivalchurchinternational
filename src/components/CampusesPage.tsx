import React, { useState } from 'react';
import { CAMPUSES, Campus } from '../data/churchData';
import { api, campusIdFor, errorMessage, serviceDateFor } from '../lib/api';
import { useToast } from './Toast';
import {
  MapPin,
  Clock,
  ArrowRight,
  ArrowLeft,
  Check,
  Radio,
  Send,
} from 'lucide-react';

interface CampusesPageProps {
  onNavigateHome: () => void;
  onOpenLive: () => void;
}

export const CampusesPage: React.FC<CampusesPageProps> = ({
  onNavigateHome,
  onOpenLive,
}) => {
  const [selectedCampus, setSelectedCampus] = useState<Campus>(CAMPUSES[0]);
  const [visitName, setVisitName] = useState('');
  const [visitEmail, setVisitEmail] = useState('');
  const [visitDate, setVisitDate] = useState('This Sunday');
  const [visitAdults, setVisitAdults] = useState('1');
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const toast = useToast();

  const handleVisitSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setError('');
    setSubmitting(true);
    try {
      await api.visit({
        name: visitName,
        email: visitEmail,
        campusId: campusIdFor(selectedCampus.name),
        serviceDate: serviceDateFor(visitDate),
        serviceTime: selectedCampus.serviceTimes[0]?.time ?? '09:00 AM',
        guests: Number(visitAdults),
      });
      setIsSuccess(true);
      toast('Your visit request has been received.');
      window.setTimeout(() => {
        setIsSuccess(false);
        setVisitName('');
        setVisitEmail('');
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
            <span className="text-slate-200 font-medium">Locations · Campuses &amp; Service Times</span>
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
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
              Regional &amp; International Hubs
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Campuses &amp; Service Times
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              Experience the supernatural presence of God in-person across our 5 physical assemblies or worship from anywhere in the world on our 24/7 Digital Broadcast Altar.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href="#all-campuses"
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-600/30 transition-all"
              >
                Explore Campuses
              </a>
              <a
                href="#plan-visit"
                className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs sm:text-sm border border-slate-700 transition-all"
              >
                Plan a VIP Visit
              </a>
            </div>
          </div>
        </div>

        {/* Campuses Grid */}
        <section id="all-campuses" className="space-y-6 scroll-mt-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CAMPUSES.map((campus) => (
              <div
                key={campus.id}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 hover:border-blue-500/50 transition-all flex flex-col justify-between shadow-xl"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded bg-blue-500/10 text-blue-400 font-mono text-[11px] font-bold">
                      {campus.country}
                    </span>
                    <span className="text-xs text-slate-400">{campus.city}</span>
                  </div>

                  <h3 className="text-xl font-bold text-white">{campus.name}</h3>
                  <p className="text-xs text-slate-300 flex items-start gap-1.5">
                    <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <span>{campus.address}</span>
                  </p>

                  {/* Services times */}
                  <div className="p-3 bg-slate-950 rounded-xl space-y-1.5 border border-slate-800 text-xs">
                    <div className="font-bold text-slate-300 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>Weekly Service Schedule</span>
                    </div>
                    {campus.serviceTimes.map((srv, idx) => (
                      <div key={idx} className="flex justify-between text-[11px] text-slate-400">
                        <span className="text-slate-300 font-medium">{srv.day}:</span>
                        <span className="text-amber-400 font-bold">{srv.time}</span>
                      </div>
                    ))}
                  </div>

                  <div className="text-xs text-slate-400 pt-1">
                    Pastoral Care: <strong className="text-white">{campus.leadPastors}</strong>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  {campus.id === 'online' ? (
                    <button
                      onClick={onOpenLive}
                      className="w-full py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                    >
                      <Radio className="w-3.5 h-3.5" />
                      <span>Enter Digital Altar</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedCampus(campus);
                        const el = document.getElementById('plan-visit');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                    >
                      <span>Plan Sunday Visit</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Plan Your Visit VIP Scheduler */}
        <section id="plan-visit" className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-12 shadow-2xl scroll-mt-24">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <span className="text-xs font-mono font-bold uppercase text-amber-400">VIP Guest Experience</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                Plan Your Sunday Visit
              </h3>
              <p className="text-xs sm:text-sm text-slate-400">
                Let us roll out the red carpet for you. We reserve parking, prepare your welcome gift pack, and pair you with a friendly host.
              </p>
            </div>

            {isSuccess ? (
              <div className="p-8 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-3 animate-in fade-in">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-white">VIP Visit Reserved!</h4>
                <p className="text-xs sm:text-sm text-slate-300">
                  Thank you, <strong className="text-white">{visitName}</strong>. Your VIP host will meet you at the Welcome Lounge this Sunday at our <strong className="text-blue-400">{selectedCampus.name}</strong> campus.
                </p>
              </div>
            ) : (
              <form onSubmit={handleVisitSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={visitName}
                      onChange={(e) => setVisitName(e.target.value)}
                      placeholder="e.g. John &amp; Sarah Smith"
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={visitEmail}
                      onChange={(e) => setVisitEmail(e.target.value)}
                      placeholder="john@domain.com"
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Campus</label>
                    <select
                      value={selectedCampus.id}
                      onChange={(e) => {
                        const found = CAMPUSES.find((c) => c.id === e.target.value);
                        if (found) setSelectedCampus(found);
                      }}
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                    >
                      {CAMPUSES.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Service Date</label>
                    <select
                      value={visitDate}
                      onChange={(e) => setVisitDate(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                    >
                      <option>This Sunday</option>
                      <option>Next Sunday</option>
                      <option>In 2 Weeks</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Guests</label>
                    <select
                      value={visitAdults}
                      onChange={(e) => setVisitAdults(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                    >
                      {[1, 2, 3, 4, 5, 6, 8, 10].map((count) => (
                        <option key={count} value={count}>{count} {count === 1 ? 'person' : 'people'}</option>
                      ))}
                    </select>
                  </div>
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
                  <span>{submitting ? 'Sending…' : 'Confirm My VIP Reservation'}</span>
                </button>
              </form>
            )}
          </div>
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
