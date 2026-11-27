import React, { useState } from 'react';
import { useContent } from '../context/ContentContext';
import { api, errorMessage, type YocoCheckoutResult } from '../lib/api';
import { useToast } from './Toast';
import { CheckoutHandoffModal } from './CheckoutHandoffModal';
import {
  Heart,
  Building2,
  Copy,
  Check,
  ArrowLeft,
} from 'lucide-react';

interface GivePageProps {
  onNavigateHome: () => void;
}

export const GivePage: React.FC<GivePageProps> = ({ onNavigateHome }) => {
  const [giveType, setGiveType] = useState('TITHE');
  const [giveAmount, setGiveAmount] = useState('500');
  const [giveCustomAmount, setGiveCustomAmount] = useState('');
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [checkout, setCheckout] = useState<YocoCheckoutResult | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { content } = useContent();
  const toast = useToast();

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      window.setTimeout(() => setCopiedField(null), 2000);
    } catch {
      toast('Clipboard access is unavailable in this browser.', 'error');
    }
  };

  const startYocoCheckout = async (fund: string) => {
    if (submitting) return;
    setError('');
    const amount = Number(currentAmount);
    if (!Number.isFinite(amount) || amount <= 0) {
      const message = 'Please enter the amount you would like to give.';
      setError(message);
      toast(message, 'error');
      return;
    }
    if (donorName.trim().length < 2) {
      const message = 'Please enter your full name.';
      setError(message);
      toast(message, 'error');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(donorEmail.trim())) {
      const message = 'Please enter a valid email for your receipt.';
      setError(message);
      toast(message, 'error');
      return;
    }

    setGiveType(fund);
    setSubmitting(true);
    try {
      const response = await api.createYocoCheckout({
        name: donorName.trim(),
        email: donorEmail.trim(),
        amount,
        fund,
      });
      if (!response.data) throw new Error('Secure checkout could not be started.');
      setCheckout(response.data);
    } catch (cause) {
      const message = errorMessage(cause);
      setError(message);
      toast(message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const currentAmount = giveCustomAmount || giveAmount;

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
            <span className="text-slate-200 font-medium">Give · Tithes &amp; Vision Fund</span>
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
        <div className="relative rounded-3xl bg-gradient-to-br from-amber-950 via-slate-900 to-slate-950 border border-slate-800 p-8 sm:p-14 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-xs font-bold">
              <Heart className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
              Kingdom Stewardship &amp; Generosity
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Honoring God with Our Substance
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              <em>"Bring all the tithes into the storehouse, that there may be food in My house..." (Malachi 3:10)</em>. Your faithful tithes and sacrificial offerings fund global apostolic revival, feed families, and build altars for the nations.
            </p>
          </div>
        </div>

        {/* Vision Fund Progress & Direct Giving Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: The Legacy Vision Fund 2026 */}
          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                Capital Campaign 2026
              </span>
              <h2 className="text-2xl font-extrabold text-white">
                The Legacy Vision Fund
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Building permanent regional revival sanctuaries, state-of-the-art 4K broadcast facilities, and expanding our daily community feeding havens.
              </p>
            </div>

            {/* Progress Bar */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-slate-300">Phase 1 Sanctuary Expansion</span>
                <span className="text-amber-400 font-mono">75% Funded</span>
              </div>
              <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden border border-slate-800">
                <div className="bg-gradient-to-r from-amber-500 to-amber-300 h-full w-[75%] rounded-full" />
              </div>
              <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                <span>Raised: R 33,750,000</span>
                <span>Goal: R 45,000,000 ($2.5M)</span>
              </div>
            </div>

            {/* Bank EFT Accounts */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-blue-400" />
                <span>Direct Bank EFT Accounts</span>
              </h3>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2 text-xs">
                <div className="flex justify-between items-center text-slate-300">
                  <span>Bank:</span>
                  <strong className="text-white">{content.bankingDetails.bankName}</strong>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Account Name:</span>
                  <strong className="text-white">{content.bankingDetails.accountName}</strong>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Account Number:</span>
                  <div className="flex items-center gap-2">
                    <strong className="text-blue-400 font-mono text-sm">{content.bankingDetails.accountNumber}</strong>
                    <button
                      onClick={() => copyToClipboard(content.bankingDetails.accountNumber, 'acc')}
                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                    >
                      {copiedField === 'acc' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Branch Code:</span>
                  <strong className="text-white font-mono">{content.bankingDetails.branchCode}</strong>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Physical Address:</span>
                  <strong className="text-white text-right text-xs">{content.bankingDetails.physicalAddress}</strong>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>SWIFT Code:</span>
                  <strong className="text-white font-mono">{content.bankingDetails.swiftCode}</strong>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Reference:</span>
                  <span className="text-amber-400 font-semibold">{content.bankingDetails.referenceGuide}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Instant Online Giving Gateway */}
          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                Secure Online Giving
              </span>
              <h2 className="text-2xl font-extrabold text-white">
                Partner With RCI
              </h2>
              <p className="text-xs text-slate-400">
                Give securely by card with Yoco. Card details are entered on Yoco&apos;s protected page — never on this website — and you return to RCI for your receipt. Bank EFT is also available.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <p className="text-slate-400">
                Choose how you would like to give. Enter your amount and details, then tap a giving button to go straight to Yoco's secure payment page.
              </p>

              {/* Amount Selection */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Amount (ZAR)</label>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {['250', '500', '1000', '2500'].map((amt) => (
                    <button
                      type="button"
                      key={amt}
                      onClick={() => {
                        setGiveAmount(amt);
                        setGiveCustomAmount('');
                      }}
                      className={`py-2 rounded-xl border font-bold font-mono transition-all cursor-pointer ${
                        giveAmount === amt && !giveCustomAmount
                          ? 'bg-amber-400 text-slate-950 border-amber-400'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white'
                      }`}
                    >
                      R {amt}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  value={giveCustomAmount}
                  onChange={(e) => setGiveCustomAmount(e.target.value)}
                  placeholder="Or enter your own amount in Rands..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Donor Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    placeholder="e.g. Sipho Sithole"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Email for Receipt</label>
                  <input
                    type="email"
                    required
                    value={donorEmail}
                    onChange={(e) => setDonorEmail(e.target.value)}
                    placeholder="sipho@domain.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Giving Type Buttons -> straight to Yoco */}
              <div>
                <label className="block font-semibold text-slate-300 mb-2">Give As</label>
                <div className="grid grid-cols-2 gap-3">
                  {['TITHE', 'OFFERING', 'SEED', 'PARTNER'].map((type) => (
                    <button
                      type="button"
                      key={type}
                      disabled={submitting}
                      onClick={() => startYocoCheckout(type)}
                      className={`py-4 rounded-2xl border font-black tracking-wide transition-all cursor-pointer disabled:opacity-60 ${
                        giveType === type
                          ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-lg shadow-amber-400/20'
                          : 'bg-slate-950 border-slate-800 text-slate-200 hover:border-amber-400 hover:text-amber-300'
                      }`}
                    >
                      {submitting && giveType === type ? 'Preparing…' : type}
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-[11px] text-slate-500">
                  TITHE, OFFERING, SEED or PARTNER will create your secure Yoco checkout using the amount and details above.
                </p>
              </div>

              {error && (
                <p role="alert" className="rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300">{error}</p>
              )}
            </div>
          </div>
        </div>

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

      {checkout && (
        <CheckoutHandoffModal checkout={checkout} onClose={() => setCheckout(null)} />
      )}
    </div>
  );
};
