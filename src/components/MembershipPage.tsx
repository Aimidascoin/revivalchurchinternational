import React, { useState } from 'react';
import { useContent } from '../context/ContentContext';
import { api, errorMessage } from '../lib/api';
import { MembershipApplicationForm } from './MembershipApplicationForm';
import { useToast } from './Toast';
import {
  CheckCircle,
  ArrowRight,
  Sparkles,
  UserCheck,
  ShieldCheck,
  HeartHandshake,
  Compass,
  ArrowLeft,
  Award,
  Check,
} from 'lucide-react';

interface MembershipPageProps {
  onNavigateHome: () => void;
  onOpenVisit: () => void;
  onOpenPrayer: () => void;
}

export const MembershipPage: React.FC<MembershipPageProps> = ({
  onNavigateHome,
  onOpenVisit,
  onOpenPrayer,
}) => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [enrollName, setEnrollName] = useState('');
  const [enrollEmail, setEnrollEmail] = useState('');
  const [enrollPhone, setEnrollPhone] = useState('');
  const [enrollCampus, setEnrollCampus] = useState('Paarl');
  const [enrollTrack, setEnrollTrack] = useState('Full 6-Week Discipleship Pathway');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { content } = useContent();
  const toast = useToast();
  const steps = content.pathway;

  const currentStep = steps[activeStepIndex];

  const handleEnrollSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setError('');
    setSubmitting(true);
    try {
      await api.contact({
        name: enrollName,
        email: enrollEmail,
        subject: `Discipleship Enrolment — ${enrollTrack} (${enrollCampus})`,
        message: `Phone: ${enrollPhone || 'not provided'}. Please enrol me on ${enrollTrack}.`,
      });
      setIsSubmitted(true);
      toast('Your enrolment request has been received.');
      window.setTimeout(() => {
        setIsSubmitted(false);
        setEnrollName('');
        setEnrollEmail('');
        setEnrollPhone('');
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
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Top Header & Breadcrumb */}
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
            <span className="text-slate-200 font-medium">Membership &amp; Discipleship</span>
          </div>

          <button
            onClick={onNavigateHome}
            className="self-start sm:self-auto px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </button>
        </div>

        {/* Hero Section of Membership Page */}
        <div className="relative rounded-3xl bg-gradient-to-br from-blue-950 via-slate-900 to-slate-950 border border-slate-800 p-8 sm:p-14 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 font-mono text-xs font-bold">
              <Award className="w-3.5 h-3.5 text-blue-400" />
              Official Covenant Membership Track
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Revival Church Membership
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              Moving from attending church in rows to thriving in covenant family. At Revival Church International, membership is not a passive title—it is an empowered commission to walk in kingdom authority, purpose, and community.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href="#pathway"
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2"
              >
                <span>Explore the 6-Step Pathway</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#register"
                className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs sm:text-sm border border-slate-700 transition-all"
              >
                Enroll in Next Cohort
              </a>
            </div>
          </div>
        </div>

        {/* ----------------- The Moved Section: Encounter · Equip · Conquer ----------------- */}
        <section id="pathway" className="py-8 relative">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="text-xs font-semibold tracking-wider uppercase text-blue-400 mb-2">
              Encounter · Equip · Conquer
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              The RCI Discipleship Pathway
            </h2>
            <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed">
              Sunday morning is only the beginning. The Pathway is our structured 6-step journey designed to take you from a first-time guest to an empowered, purpose-driven kingdom leader.
            </p>
          </div>

          {/* Step Indicator Navigation (Tab Bar) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-10">
            {steps.map((stepItem, idx) => {
              const isCurrent = idx === activeStepIndex;
              return (
                <button
                  key={stepItem.step}
                  onClick={() => setActiveStepIndex(idx)}
                  className={`p-3.5 rounded-xl text-left transition-all border cursor-pointer ${
                    isCurrent
                      ? 'bg-blue-600/20 border-blue-500/80 text-white shadow-lg shadow-blue-500/10'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-slate-800 text-blue-400">
                      Step 0{stepItem.step}
                    </span>
                    <span className="text-[11px] text-slate-400">{stepItem.duration}</span>
                  </div>
                  <div className="text-xs sm:text-sm font-bold truncate text-slate-100">
                    {stepItem.title}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Expanded Active Step Showcase */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                    {currentStep.step}
                  </span>
                  <span className="text-xs uppercase tracking-wider font-bold text-blue-400">
                    {currentStep.duration} Roadmap
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {currentStep.headline}
                </h3>

                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  {currentStep.description}
                </p>

                <div className="pt-3 flex flex-wrap items-center gap-4">
                  <button
                    onClick={onOpenVisit}
                    className="px-6 py-3 text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-md shadow-blue-600/25 flex items-center gap-2 cursor-pointer"
                  >
                    <span>{currentStep.actionText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="text-xs text-slate-400 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>Runs termly at all campuses &amp; online</span>
                  </div>
                </div>
              </div>

              {/* Right Card: What You Will Experience */}
              <div className="lg:col-span-4 bg-slate-950/80 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-inner">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Key Milestones &amp; Outcomes</span>
                </div>
                <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
                  <li className="flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <span>Complete clarity on RCI apostolic DNA and prophetic theology</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <HeartHandshake className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <span>Personal connection with campus pastors and cell leaders</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <UserCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <span>Placement in a ministry team aligned with your spiritual gifts</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Compass className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <span>Certificate of Completion &amp; official covenant membership</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Enrollment Form Section */}
        <section id="register" className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-12 shadow-2xl">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <span className="text-xs uppercase font-mono font-bold text-amber-400">Step In Today</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                Register for the Next Membership Cohort
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm mt-2">
                Classes meet on Sunday mornings 1 hour prior to services or via live Zoom interactive workshops on Thursday evenings.
              </p>
            </div>

            {isSubmitted ? (
              <div className="p-8 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Enrollment Confirmed!</h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
                  Thank you, <strong className="text-white">{enrollName}</strong>. Our Pastoral Discipleship Dean has received your enrollment for the <strong className="text-emerald-400">{enrollCampus}</strong> campus. An orientation pack has been dispatched to your email.
                </p>
              </div>
            ) : (
              <form onSubmit={handleEnrollSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={enrollName}
                      onChange={(e) => setEnrollName(e.target.value)}
                      placeholder="e.g. David &amp; Ruth Ndlovu"
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-3 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={enrollEmail}
                      onChange={(e) => setEnrollEmail(e.target.value)}
                      placeholder="yourname@domain.com"
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-3 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Mobile / WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      value={enrollPhone}
                      onChange={(e) => setEnrollPhone(e.target.value)}
                      placeholder="+27 (0) 82 000 0000"
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-3 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Preferred Campus
                    </label>
                    <select
                      value={enrollCampus}
                      onChange={(e) => setEnrollCampus(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-3 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="Paarl">Paarl (Western Cape)</option>
                      <option value="Cape Town Campus">Cape Town Campus (Century City)</option>
                      <option value="Dolphin Coast (Ballito)">Dolphin Coast (Ballito)</option>
                      <option value="London UK Campus">London UK Campus (Westminster)</option>
                      <option value="Atlanta USA Campus">Atlanta USA Campus (Buckhead)</option>
                      <option value="Global Online Campus">Global Online Campus (Virtual Zoom)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Select Discipleship Focus
                  </label>
                  <select
                    value={enrollTrack}
                    onChange={(e) => setEnrollTrack(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-3 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Full 6-Week Discipleship Pathway">Full 6-Week Discipleship Pathway (Week 1–6)</option>
                    <option value="Foundations 101 & Covenant Membership">Foundations 101 &amp; Covenant Membership Only</option>
                    <option value="V-Team Volunteer Deployment">V-Team Volunteer Deployment &amp; Ministry Placement</option>
                    <option value="Empowerment 201 Leadership Track">Empowerment 201 Leadership Track</option>
                  </select>
                </div>

                {error && (
                  <p role="alert" className="rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300">{error}</p>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    <span>{submitting ? 'Submitting…' : 'Submit Membership Enrollment'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>

        {/* Online Membership Application */}
        <section id="membership-application" className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-12 shadow-2xl">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <span className="text-xs uppercase font-mono font-bold text-amber-400">Apply Online</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                Church Membership Application
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm">
                Complete the form below to apply for membership at Revival Church International.
              </p>
            </div>
            <MembershipApplicationForm />
          </div>
        </section>

        {/* Bottom Navigation Back to Home */}
        <div className="flex flex-col items-center gap-3 pt-4 pb-8">
          <button
            onClick={onOpenPrayer}
            className="inline-flex items-center gap-2 rounded-xl border border-blue-500/40 bg-blue-600/10 px-4 py-2.5 text-xs font-bold text-blue-300 hover:bg-blue-600/20 transition-colors cursor-pointer"
          >
            <HeartHandshake className="h-3.5 w-3.5" />
            <span>Prayer Support for Your Next Step</span>
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
