import React, { useEffect, useState } from 'react';
import { CAMPUSES } from '../data/churchData';
import { Check, Gift, Car, Coffee, ShieldCheck } from 'lucide-react';
import { api, campusIdFor, errorMessage } from '../lib/api';
import { useToast } from './Toast';

interface PlanVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCampus?: string;
}

export const PlanVisitModal: React.FC<PlanVisitModalProps> = ({
  isOpen,
  onClose,
  defaultCampus,
}) => {
  const [selectedCampus, setSelectedCampus] = useState(defaultCampus || 'Paarl Campus');
  const [serviceDate, setServiceDate] = useState('');
  const [serviceTime, setServiceTime] = useState('09:30 SAST');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+27');
  const [adultCount, setAdultCount] = useState(1);
  const [kidCount, setKidCount] = useState(0);
  const [needsParking, setNeedsParking] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [vipPassCode, setVipPassCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const toast = useToast();

  useEffect(() => {
    if (isOpen && defaultCampus) setSelectedCampus(defaultCampus);
  }, [isOpen, defaultCampus]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setError('');
    setSubmitting(true);
    try {
      const response = await api.visit({
        name: guestName,
        email: guestEmail,
        phone: `${countryCode}${guestPhone}`,
        campusId: campusIdFor(selectedCampus),
        serviceDate,
        serviceTime,
        guests: adultCount + kidCount,
        needsParking,
        notes: `${adultCount} adults, ${kidCount} children`,
      });
      setVipPassCode(`RCI-VIP-${response.data?.id.slice(0, 8).toUpperCase() ?? 'RESERVED'}`);
      setIsSuccess(true);
      toast('Your VIP visit has been booked.');
    } catch (cause) {
      const message = errorMessage(cause);
      setError(message);
      toast(message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDone = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-950 border border-slate-800 rounded-3xl w-full max-w-lg max-h-[92vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative text-slate-100">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
              <Gift className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white">VIP Guest Experience</h3>
              <p className="text-xs text-slate-400">Let our hospitality team prepare for your arrival</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-900 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {isSuccess ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
              <Check className="w-7 h-7" />
            </div>
            <h4 className="text-xl font-bold text-white">We Can’t Wait to Welcome You!</h4>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
              Your VIP Visit to <strong>{selectedCampus}</strong> on <strong>{serviceDate} ({serviceTime})</strong> is booked.
            </p>

            <div className="p-4 bg-slate-900 rounded-2xl border border-dashed border-blue-500/40 text-left space-y-2">
              <div className="text-[11px] font-mono uppercase text-blue-400 font-bold">
                VIP Pass: {vipPassCode}
              </div>
              <div className="text-xs text-slate-300 font-semibold">Your Guest Perks Ready on Arrival:</div>
              <ul className="text-xs text-slate-400 space-y-1">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Reserved VIP auditorium seating for your party</span>
                </li>
                <li className="flex items-center gap-2">
                  <Coffee className="w-3.5 h-3.5 text-amber-400" />
                  <span>Complimentary barista coffee &amp; Welcome Gift Pack</span>
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                  <span>Fast-track check-in for Revival Kidz</span>
                </li>
              </ul>
            </div>

            <button
              onClick={handleDone}
              className="w-full py-3 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-colors cursor-pointer"
            >
              Done &amp; Add to Calendar
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Choose Campus
              </label>
              <select
                value={selectedCampus}
                onChange={(e) => setSelectedCampus(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {CAMPUSES.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name} ({c.city})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Expected Gathering Date
                </label>
                <input
                  type="date"
                  required
                  value={serviceDate}
                  onChange={(e) => setServiceDate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500 [color-scheme:dark]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Service Time
                </label>
                <select
                  value={serviceTime}
                  onChange={(e) => setServiceTime(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="09:30 SAST">09:30 SAST</option>
                  <option value="19:00 SAST">19:00 SAST</option>
                  <option value="Midweek 19:00 SAST">Midweek · 19:00 SAST</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Your Full Name
              </label>
              <input
                type="text"
                required
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="e.g. John & Sarah Smith"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  placeholder="samuel@example.com"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Mobile / WhatsApp
                </label>
                <div className="flex gap-2">
                  <select
                    aria-label="Country code"
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="w-28 shrink-0 bg-slate-900 border border-slate-800 rounded-xl px-2 py-2 text-xs sm:text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="+27">ZA +27</option>
                    <option value="+44">UK +44</option>
                    <option value="+1">US +1</option>
                    <option value="+234">NG +234</option>
                    <option value="+254">KE +254</option>
                    <option value="+263">ZW +263</option>
                    <option value="+258">MZ +258</option>
                    <option value="+267">BW +267</option>
                    <option value="+260">ZM +260</option>
                    <option value="+49">DE +49</option>
                  </select>
                  <input
                    type="tel"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    placeholder="83 555 1234"
                    className="min-w-0 flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Adults Attending
                </label>
                <select
                  value={adultCount}
                  onChange={(e) => setAdultCount(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {[1, 2, 3, 4, 5, 6, 8].map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? 'Adult' : 'Adults'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Children (Ages 1-12)
                </label>
                <select
                  value={kidCount}
                  onChange={(e) => setKidCount(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {[0, 1, 2, 3, 4, 5, 6].map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? 'Child' : 'Children'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-300">
              <input
                type="checkbox"
                id="parking"
                checked={needsParking}
                onChange={(e) => setNeedsParking(e.target.checked)}
                className="rounded bg-slate-900 border-slate-800 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="parking" className="flex items-center gap-1 cursor-pointer">
                <Car className="w-3.5 h-3.5 text-blue-400" />
                <span>Reserve parking space in our visitor bays</span>
              </label>
            </div>

            {error && (
              <p role="alert" className="rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300">
                {error}
              </p>
            )}

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg shadow-blue-600/30 flex items-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <span>{submitting ? 'Booking…' : 'Confirm VIP Visit'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
