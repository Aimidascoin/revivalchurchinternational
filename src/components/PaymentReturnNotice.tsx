import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, Heart, XCircle } from 'lucide-react';

interface PaymentReturnNoticeProps {
  onNavigateGive: () => void;
  onNavigateHome: () => void;
}

type Outcome = 'success' | 'cancelled' | 'failed';

/** RCI-branded receipt/handoff shown after Yoco returns the visitor home. */
export const PaymentReturnNotice: React.FC<PaymentReturnNoticeProps> = ({ onNavigateGive, onNavigateHome }) => {
  const params = new URLSearchParams(window.location.search);
  const initial = params.get('giving');
  const [outcome] = useState<Outcome | null>(
    initial === 'success' || initial === 'cancelled' || initial === 'failed' ? initial : null,
  );
  const [reference] = useState(params.get('reference') ?? '');
  const [visible, setVisible] = useState(true);

  if (!outcome || !visible) return null;

  const dismiss = () => {
    params.delete('giving');
    params.delete('reference');
    const query = params.toString();
    window.history.replaceState(
      {},
      '',
      `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`,
    );
    setVisible(false);
  };

  const content = {
    success: {
      icon: <CheckCircle2 className="h-7 w-7 text-emerald-400" />,
      title: 'TRANSACTION SUCCEED...',
      body: 'THANK YOU FOR SUPPORTING OUR MINISTRIES',
      tone: 'border-emerald-500/40 bg-emerald-950/40',
    },
    cancelled: {
      icon: <XCircle className="h-7 w-7 text-amber-400" />,
      title: 'Payment not completed',
      body: 'You cancelled before paying. No amount was charged — you can try again at any time.',
      tone: 'border-amber-500/40 bg-amber-950/30',
    },
    failed: {
      icon: <AlertCircle className="h-7 w-7 text-red-400" />,
      title: 'Payment could not be completed',
      body: 'No amount was charged. Please check your details or use bank EFT instead.',
      tone: 'border-red-500/40 bg-red-950/30',
    },
  }[outcome];

  return (
    <div className="fixed inset-0 z-[65] flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md">
      <div className={`w-full max-w-lg rounded-3xl border ${content.tone} bg-slate-950 p-7 text-center shadow-2xl`}>
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-900">
          {content.icon}
        </div>
        <div className="mt-4 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-amber-400">
          <Heart className="h-3.5 w-3.5" />
          Revival Church International
        </div>
        <h3 className="mt-2 text-2xl font-extrabold text-white">{content.title}</h3>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-300">{content.body}</p>
        {reference && (
          <p className="mt-4 font-mono text-xs text-amber-400">Reference: {reference}</p>
        )}
        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          {outcome === 'success' ? (
            <button
              onClick={() => {
                dismiss();
                onNavigateHome();
              }}
              className="flex-1 rounded-xl bg-amber-400 px-5 py-3 text-xs font-black text-slate-950 hover:bg-amber-300"
            >
              Return to Home Page
            </button>
          ) : (
            <button
              onClick={() => {
                dismiss();
                onNavigateGive();
              }}
              className="flex-1 rounded-xl bg-amber-400 px-5 py-3 text-xs font-black text-slate-950 hover:bg-amber-300"
            >
              Try giving again
            </button>
          )}
          <button
            onClick={dismiss}
            className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 text-xs font-bold text-slate-200 hover:bg-slate-800"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
