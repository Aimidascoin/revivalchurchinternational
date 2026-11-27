import React from 'react';
import { Heart, Lock, ShieldCheck, X } from 'lucide-react';
import type { YocoCheckoutResult } from '../lib/api';

interface CheckoutHandoffModalProps {
  checkout: YocoCheckoutResult;
  onClose: () => void;
}

/**
 * RCI-branded checkout shell. Yoco's hosted payment page is embedded here
 * so the visitor remains inside the RCI experience while entering card
 * details. The iframe keeps the RCI origin as referrer for Yoco's domain
 * verification — never set referrerPolicy to no-referrer/same-origin.
 */
export const CheckoutHandoffModal: React.FC<CheckoutHandoffModalProps> = ({
  checkout,
  onClose,
}) => (
  <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/95 p-2 sm:p-4 backdrop-blur-md">
    <div className="flex h-[94vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 shadow-2xl sm:rounded-3xl">
      {/* RCI chrome — stays visible for the entire payment process */}
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-800 bg-gradient-to-r from-amber-950/50 via-slate-900 to-slate-950 px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
            <Heart className="h-4 w-4 fill-amber-400/30" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-[10px] font-bold uppercase tracking-[0.2em] text-amber-400 sm:text-xs">
              Revival Church International
            </p>
            <h3 className="truncate text-sm font-extrabold text-white sm:text-lg">
              Secure Giving Checkout
            </h3>
          </div>
        </div>
        <div className="hidden text-right sm:block">
          <p className="text-sm font-bold text-white">R {checkout.amount.toLocaleString('en-ZA')}</p>
          <p className="max-w-[240px] truncate text-[11px] text-slate-400">{checkout.fund}</p>
        </div>
        <button
          onClick={onClose}
          aria-label="Close checkout"
          className="shrink-0 rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Yoco's secure hosted payment page, framed inside RCI */}
      <iframe
        src={checkout.redirectUrl}
        title="Secure payment checkout"
        referrerPolicy="strict-origin-when-cross-origin"
        className="min-h-0 w-full flex-1 bg-white"
      />

      <div className="flex shrink-0 items-center justify-center gap-2 border-t border-slate-800 bg-slate-900 px-4 py-2.5 text-[10px] text-slate-400 sm:text-[11px]">
        <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-blue-400" />
        <span className="text-center">
          Card details are handled by Yoco&apos;s secure checkout. RCI never sees or stores them.
        </span>
        <Lock className="hidden h-3 w-3 shrink-0 sm:block" />
      </div>
    </div>
  </div>
);
