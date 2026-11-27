import React, { useState } from 'react';
import { api, errorMessage } from '../lib/api';
import { useToast } from './Toast';
import {
  Sparkles,
  ShieldCheck,
  Check,
  Send,
  ArrowLeft,
} from 'lucide-react';

interface CarePageProps {
  onNavigateHome: () => void;
  onOpenGive: () => void;
}

export const CarePage: React.FC<CarePageProps> = ({
  onNavigateHome,
  onOpenGive,
}) => {
  const [petitionerName, setPetitionerName] = useState('');
  const [petitionerEmail, setPetitionerEmail] = useState('');
  const [petitionerPhone, setPetitionerPhone] = useState('');
  const [petitionerCategory, setPetitionerCategory] = useState('Healing & Supernatural Health');
  const [petitionerConfidentiality, setPetitionerConfidentiality] = useState('Confidential (Pastors Only)');
  const [petitionerDetails, setPetitionerDetails] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const toast = useToast();

  const handlePrayerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setError('');
    setSubmitting(true);
    try {
      await api.prayerRequest({
        name: petitionerName,
        email: petitionerEmail,
        phone: petitionerPhone,
        category: petitionerCategory,
        details: petitionerDetails,
        isPublic: !petitionerConfidentiality.toLowerCase().startsWith('confidential'),
      });
      setIsSuccess(true);
      toast('Your prayer request has been received.');
      window.setTimeout(() => {
        setIsSuccess(false);
        setPetitionerName('');
        setPetitionerEmail('');
        setPetitionerPhone('');
        setPetitionerDetails('');
      }, 4500);
    } catch (cause) {
      const message = errorMessage(cause);
      setError(message);
      toast(message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const careServices = [
    {
      title: 'Hospital & Home Visitation',
      description: 'Our pastoral team and ordained elders visit sick family members in hospitals or homes to lay hands and pray the prayer of faith.',
      availability: '24/7 On-Call Support',
    },
    {
      title: 'Biblical Pastoral Counseling',
      description: 'Confidential, scripture-rooted counseling for marriage enrichment, grief, crisis resolution, and spiritual direction.',
      availability: 'Tuesdays to Fridays by Appointment',
    },
    {
      title: 'Baby Dedications & Water Baptism',
      description: 'Committing newborn infants to the Lord and public declarations of faith through believer’s water baptism by full immersion.',
      availability: 'Monthly Ceremonies at All Campuses',
    },
    {
      title: 'Bereavement & Funeral Ministry',
      description: 'Walking beside families through the valley of sorrow with loving pastoral presence, funeral service officiating, and aftercare.',
      availability: 'Immediate Pastoral Dispatch',
    },
  ];

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
            <span className="text-slate-200 font-medium">Care · Prayer &amp; Pastoral Support</span>
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
        <div className="relative rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border border-slate-800 p-8 sm:p-14 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 font-mono text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Pastoral Care &amp; 24/7 Prayer Altar
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              You Are Never Alone in the Battle
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              Whatever mountain you are facing—sickness, grief, financial hardship, or family turmoil—our pastoral prayer altar and ordained ministers stand in faith with you.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href="#prayer-altar"
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-600/30 transition-all"
              >
                Submit Prayer Request
              </a>
              <a
                href="#pastoral-care"
                className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs sm:text-sm border border-slate-700 transition-all"
              >
                Pastoral Care Services
              </a>
              <a
                href="#compassion"
                className="px-6 py-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-xs sm:text-sm border border-amber-500/40 transition-all"
              >
                Revival Hope Relief
              </a>
            </div>
          </div>
        </div>

        {/* 1. The 24/7 Prayer Request Altar Form */}
        <section id="prayer-altar" className="scroll-mt-24">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-12 shadow-2xl">
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="text-center space-y-2">
                <span className="text-xs uppercase font-mono font-bold text-blue-400">Direct to Pastoral Prayer Tower</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Lift Your Petition Before God
                </h2>
                <p className="text-xs sm:text-sm text-slate-400">
                  Every request submitted here is prayed over individually by Prophet Herbert, Pastor Shelma, and our dedicated intercessory prayer warriors.
                </p>
              </div>

              {isSuccess ? (
                <div className="p-8 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-3 animate-in fade-in">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Petition Received in the Secret Place!</h3>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
                    Thank you, <strong className="text-white">{petitionerName}</strong>. Your petition has been entered onto the pastoral prayer altar. Stand in expectation: <em>"The prayer of faith will save the sick, and the Lord will raise him up" (James 5:15).</em>
                  </p>
                </div>
              ) : (
                <form onSubmit={handlePrayerSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        value={petitionerName}
                        onChange={(e) => setPetitionerName(e.target.value)}
                        placeholder="e.g. Nomsa Dlamini"
                        className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Email Address</label>
                      <input
                        type="email"
                        value={petitionerEmail}
                        onChange={(e) => setPetitionerEmail(e.target.value)}
                        placeholder="nomsa@domain.com"
                        className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Phone / WhatsApp</label>
                      <input
                        type="tel"
                        value={petitionerPhone}
                        onChange={(e) => setPetitionerPhone(e.target.value)}
                        placeholder="+27 (0) 82 000 0000"
                        className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Petition Category *</label>
                      <select
                        value={petitionerCategory}
                        onChange={(e) => setPetitionerCategory(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                      >
                        <option>Healing &amp; Supernatural Health</option>
                        <option>Financial &amp; Business Breakthrough</option>
                        <option>Marriage &amp; Family Restoration</option>
                        <option>Deliverance &amp; Spiritual Warfare</option>
                        <option>Salvation of Loved Ones</option>
                        <option>Fruit of the Womb (Conception)</option>
                        <option>Career Direction &amp; Relocation</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Confidentiality Preference</label>
                    <select
                      value={petitionerConfidentiality}
                      onChange={(e) => setPetitionerConfidentiality(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                    >
                      <option>Confidential (Pastors Only)</option>
                      <option>RCI Intercessory Prayer Network (First name only)</option>
                      <option>Public Praise &amp; Prayer during Service</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Prayer Request Details *</label>
                    <textarea
                      rows={4}
                      required
                      value={petitionerDetails}
                      onChange={(e) => setPetitionerDetails(e.target.value)}
                      placeholder="Share your burden openly. God answers prayer..."
                      className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                    />
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
                    <span>{submitting ? 'Sending…' : 'Submit to Prayer Altar'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* 2. Pastoral Care Services */}
        <section id="pastoral-care" className="space-y-6 scroll-mt-24">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-mono font-bold uppercase text-blue-400">Pastoral Ministry</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Comprehensive Pastoral Care Services
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Our ordained shepherds are available to minister to you and your family in every season of life.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {careServices.map((service, idx) => (
              <div
                key={idx}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">{service.title}</h3>
                    <span className="px-2.5 py-0.5 rounded bg-blue-600/10 text-blue-400 font-mono text-[11px] font-bold">
                      {service.availability}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {service.description}
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Call Pastoral Desk:</span>
                  <a href="tel:+27117849000" className="font-bold text-blue-400 hover:text-blue-300">
                    +27 (0) 11 784 9000
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Revival Hope Haven & Food Bank Compassion */}
        <section id="compassion" className="bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-2xl scroll-mt-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold rounded-full">
                Revival Hope Compassion Initiative
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
                Extending Christ’s Hands to the Needy &amp; Vulnerable
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Revival Hope operates community food pantries, emergency clothing drives, and school supply distribution across Gauteng, Western Cape, and KwaZulu-Natal. Every month, over 1,500 families receive nutritious food parcels.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={onOpenGive}
                  className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs sm:text-sm shadow-lg shadow-amber-400/20 cursor-pointer"
                >
                  Donate to Food Bank
                </button>
                <a
                  href="#prayer-altar"
                  className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs sm:text-sm border border-slate-700"
                >
                  Request Emergency Assistance
                </a>
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Monthly Relief Impact</span>
              </h4>
              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex justify-between border-b border-slate-800 pb-1">
                  <span>Food Hampers Distributed:</span>
                  <strong className="text-white">1,540 Parcels</strong>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-1">
                  <span>Single-Mother Stipends:</span>
                  <strong className="text-white">85 Families</strong>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-1">
                  <span>School Shoes &amp; Uniforms:</span>
                  <strong className="text-white">620 Students</strong>
                </div>
              </div>
            </div>
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
