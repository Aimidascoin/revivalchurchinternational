import React, { useState } from 'react';
import { Heart, Building, Copy, Check, DollarSign, ShieldCheck } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import { api, errorMessage, type GivingResult, type YocoCheckoutResult } from '../lib/api';
import { useToast } from './Toast';
import { CheckoutHandoffModal } from './CheckoutHandoffModal';

interface GivingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const funds = [
  'Tithes & Offerings',
  'Legacy Vision Fund 2026',
  'Revival Hope Compassion',
  'Global Missions & Media',
  'School of Ministry Scholarship',
];

const amounts: Record<string, string[]> = {
  ZAR: ['100', '250', '500', '1000', '2500', '5000'],
  USD: ['25', '50', '100', '250', '500', '1000'],
  GBP: ['20', '50', '100', '200', '500', '1000'],
};

export const GivingModal: React.FC<GivingModalProps> = ({ isOpen, onClose }) => {
  const { content } = useContent();
  const toast = useToast();
  const [currency, setCurrency] = useState<'ZAR' | 'USD' | 'GBP'>('ZAR');
  const [fund, setFund] = useState(funds[0]);
  const [amount, setAmount] = useState('500');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [method, setMethod] = useState<'bank' | 'online'>('online');
  const [checkout, setCheckout] = useState<YocoCheckoutResult | null>(null);
  const [copied, setCopied] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<GivingResult | null>(null);

  if (!isOpen) return null;

  if (checkout) {
    return (
      <CheckoutHandoffModal
        checkout={checkout}
        onClose={() => {
          setCheckout(null);
          onClose();
        }}
      />
    );
  }

  const symbol = currency === 'ZAR' ? 'R' : currency === 'USD' ? '$' : '£';
  const bank = result?.bankingDetails ?? content.bankingDetails;

  const copy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      window.setTimeout(() => setCopied(''), 2000);
    } catch {
      toast('Clipboard access is unavailable in this browser.', 'error');
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (submitting) return;
    setError('');
    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0) {
      setError('Please enter a valid amount.');
      return;
    }
    setSubmitting(true);
    try {
      if (method === 'online') {
        if (currency !== 'ZAR') {
          setError('Yoco accepts South African Rand only. Switch to ZAR to give by card.');
          return;
        }
        const response = await api.createYocoCheckout({ name, email, amount: value, fund });
        if (!response.data) throw new Error('Secure checkout could not be started.');
        setCheckout(response.data);
        return;
      }
      const response = await api.giving({
        name,
        email,
        amount: value,
        currency,
        fund,
        method: 'bank',
      });
      setResult(response.data ?? null);
      toast('Thank you — your giving pledge has been recorded.');
    } catch (cause) {
      const message = errorMessage(cause);
      setError(message);
      toast(message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setResult(null);
    setCheckout(null);
    setError('');
    setName('');
    setEmail('');
    setAmount('500');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl border border-slate-800 bg-slate-950 p-6 text-slate-100 shadow-2xl sm:p-8">
        <div className="mb-6 flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
              <Heart className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-white">Partner with RCI</h3>
              <p className="text-xs text-slate-400">"Honour the Lord with your substance" — Proverbs 3:9</p>
            </div>
          </div>
          <button onClick={reset} className="rounded-xl p-2 text-slate-400 hover:bg-slate-900 hover:text-white">
            ✕
          </button>
        </div>

        {result ? (
          <div className="space-y-5 py-4 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
              <Check className="h-8 w-8" />
            </div>
            <div>
              <h4 className="text-2xl font-bold text-white">Generosity Received!</h4>
              <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-300">
                Thank you for your pledge of <strong>{currency} {amount}</strong> to <strong>{fund}</strong>.
              </p>
            </div>
            <div className="mx-auto inline-flex items-center gap-2 rounded-xl border border-blue-500/30 bg-blue-500/10 px-4 py-2 font-mono text-xs text-blue-300">
              Reference: {result.reference}
              <button type="button" onClick={() => copy(result.reference, 'ref')} title="Copy reference">
                {copied === 'ref' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
            {result.bankingDetails && (
              <div className="mx-auto max-w-md space-y-1.5 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-left font-mono text-xs">
                <p className="font-sans font-semibold text-slate-200">Complete your EFT using:</p>
                <p className="flex justify-between"><span className="text-slate-400">Account</span><span>{bank.accountNumber}</span></p>
                <p className="flex justify-between"><span className="text-slate-400">Bank</span><span>{bank.bankName}</span></p>
                <p className="flex justify-between"><span className="text-slate-400">Branch</span><span>{bank.branchCode}</span></p>
                <p className="flex justify-between"><span className="text-slate-400">Address</span><span className="text-right">{bank.physicalAddress}</span></p>
                <p className="flex justify-between"><span className="text-slate-400">Reference</span><span className="text-amber-400">{result.reference}</span></p>
              </div>
            )}
            <button onClick={reset} className="w-full rounded-xl bg-blue-600 py-3 text-xs font-bold text-white hover:bg-blue-500">
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-300">Giving Designation</label>
                <select value={fund} onChange={(e) => setFund(e.target.value)} className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2.5 text-xs text-white">
                  {funds.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-300">Currency</label>
                <div className="grid grid-cols-3 gap-1 rounded-xl border border-slate-800 bg-slate-900 p-1 text-center text-xs font-bold">
                  {(['ZAR', 'USD', 'GBP'] as const).map((curr) => (
                    <button
                      key={curr}
                      type="button"
                      onClick={() => { setCurrency(curr); setAmount(amounts[curr][2]); }}
                      className={`rounded-lg py-1.5 ${currency === curr ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                      {curr}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold text-slate-300">Seed Amount ({currency})</label>
              <div className="mb-3 grid grid-cols-3 gap-2 sm:grid-cols-6">
                {amounts[currency].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setAmount(preset)}
                    className={`rounded-xl border py-2 text-xs font-bold ${amount === preset ? 'border-blue-500 bg-blue-600/30 text-white' : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'}`}
                  >
                    {symbol}{preset}
                  </button>
                ))}
              </div>
              <input
                type="number"
                min="1"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                aria-label="Custom amount"
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2 text-xs text-white"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" aria-label="Full name" className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2 text-xs text-white" />
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email for your receipt" aria-label="Email" className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2 text-xs text-white" />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold text-slate-300">How would you like to give?</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setMethod('online');
                    if (currency !== 'ZAR') {
                      setCurrency('ZAR');
                      setAmount('500');
                    }
                  }}
                  className={`flex items-center justify-center gap-2 rounded-xl border py-2.5 text-xs font-semibold ${method === 'online' ? 'border-amber-400 bg-amber-500/15 text-white' : 'border-slate-800 text-slate-400'}`}
                >
                  <DollarSign className="h-3.5 w-3.5" /> Pay with Yoco
                </button>
                <button
                  type="button"
                  onClick={() => setMethod('bank')}
                  className={`flex items-center justify-center gap-2 rounded-xl border py-2.5 text-xs font-semibold ${method === 'bank' ? 'border-blue-500 bg-blue-600/20 text-white' : 'border-slate-800 text-slate-400'}`}
                >
                  <Building className="h-3.5 w-3.5" /> Bank EFT
                </button>
              </div>
              <p className="mt-2 text-[11px] text-slate-500">
                {method === 'online'
                  ? 'Review your gift on an RCI-branded page, then pay securely on Yoco. Card details never touch this website.'
                  : 'A pledge is recorded here; transfer the amount using the bank details shown after submission.'}
              </p>
            </div>

            {error && <p role="alert" className="rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-xs font-bold text-white hover:bg-blue-500 disabled:opacity-60"
            >
              <ShieldCheck className="h-4 w-4" />
              {submitting
                ? 'Preparing secure checkout…'
                : method === 'online'
                  ? `Give ${symbol}${amount} securely with Yoco`
                  : `Record ${currency} ${amount} pledge`}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
