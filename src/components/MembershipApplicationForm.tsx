import React, { useState } from 'react';
import { api, errorMessage } from '../lib/api';
import { useToast } from './Toast';
import {
  CheckCircle,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';

const HEAR_OPTIONS = [
  'Friend or Family',
  'Social Media',
  'Church Website',
  'Event or Crusade',
  'Walk-in Visit',
  'Other',
];

interface FormState {
  title: string;
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
  mobile: string;
  nationality: string;
  street: string;
  city: string;
  province: string;
  postal: string;
  country: string;
  isMember: 'Yes' | 'No';
  hearAbout: string;
  consent: boolean;
}

const initialState: FormState = {
  title: '',
  firstName: '',
  lastName: '',
  gender: '',
  email: '',
  mobile: '',
  nationality: '',
  street: '',
  city: '',
  province: '',
  postal: '',
  country: 'South Africa',
  isMember: 'No',
  hearAbout: HEAR_OPTIONS[0],
  consent: false,
};

export const MembershipApplicationForm: React.FC = () => {
  const toast = useToast();
  const [form, setForm] = useState<FormState>(initialState);
  const [step, setStep] = useState<'form' | 'review'>('form');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const update = (field: keyof FormState, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validate = (): string | null => {
    if (!form.firstName.trim()) return 'First name is required.';
    if (!form.lastName.trim()) return 'Last name is required.';
    if (!form.gender) return 'Gender is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return 'A valid email is required.';
    if (!form.mobile.trim()) return 'Mobile number is required.';
    if (!form.street.trim()) return 'Street address is required.';
    if (!form.city.trim()) return 'City is required.';
    if (!form.province.trim()) return 'State/Region/Province is required.';
    if (!form.postal.trim()) return 'Postal / Zip code is required.';
    if (!form.consent) return 'You must consent to your information being processed.';
    return null;
  };

  const handleReview = (e: React.FormEvent) => {
    e.preventDefault();
    const message = validate();
    if (message) {
      setError(message);
      toast(message, 'error');
      return;
    }
    setError('');
    setStep('review');
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    setError('');
    try {
      const fullName = `${form.title} ${form.firstName} ${form.lastName}`.trim();
      const message = [
        `Title: ${form.title || 'N/A'}`,
        `First Name: ${form.firstName}`,
        `Last Name: ${form.lastName}`,
        `Gender: ${form.gender}`,
        `Email: ${form.email}`,
        `Mobile: +27 ${form.mobile}`,
        `Nationality: ${form.nationality || 'N/A'}`,
        `Address: ${form.street}, ${form.city}, ${form.province}, ${form.postal}, ${form.country}`,
        `Existing Member: ${form.isMember}`,
        `Heard About Us Via: ${form.hearAbout}`,
        `Consent Given: ${form.consent ? 'Yes' : 'No'}`,
      ].join('\n');

      await api.contact({
        name: fullName,
        email: form.email.trim(),
        subject: 'Online Membership Application',
        message,
      });

      setSuccess(true);
      toast('Your membership application has been submitted.');
      setForm(initialState);
      setStep('form');
    } catch (cause) {
      const message = errorMessage(cause);
      setError(message);
      toast(message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="rounded-3xl border border-emerald-500/40 bg-emerald-950/40 p-8 text-center space-y-3">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
          <CheckCircle className="h-6 w-6" />
        </div>
        <h3 className="text-xl font-bold text-white">Application Received</h3>
        <p className="text-sm text-slate-300">
          Thank you for applying for membership at Revival Church International. Our pastoral team will review your application and be in touch shortly.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="mt-4 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-500"
        >
          Submit Another Application
        </button>
      </div>
    );
  }

  if (step === 'review') {
    return (
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-blue-400" />
          <h3 className="text-xl font-bold text-white">Review Your Application</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div><span className="text-slate-400">Name:</span> <span className="text-white font-semibold">{form.title} {form.firstName} {form.lastName}</span></div>
          <div><span className="text-slate-400">Gender:</span> <span className="text-white font-semibold">{form.gender}</span></div>
          <div><span className="text-slate-400">Email:</span> <span className="text-white font-semibold">{form.email}</span></div>
          <div><span className="text-slate-400">Mobile:</span> <span className="text-white font-semibold">+27 {form.mobile}</span></div>
          <div><span className="text-slate-400">Nationality:</span> <span className="text-white font-semibold">{form.nationality || 'N/A'}</span></div>
          <div className="sm:col-span-2"><span className="text-slate-400">Address:</span> <span className="text-white font-semibold">{form.street}, {form.city}, {form.province}, {form.postal}, {form.country}</span></div>
          <div><span className="text-slate-400">Existing Member:</span> <span className="text-white font-semibold">{form.isMember}</span></div>
          <div><span className="text-slate-400">Heard About Us:</span> <span className="text-white font-semibold">{form.hearAbout}</span></div>
        </div>
        {error && <p role="alert" className="rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300">{error}</p>}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => setStep('form')}
            className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 text-xs font-bold text-slate-200 hover:bg-slate-800"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 rounded-xl bg-blue-600 px-5 py-3 text-xs font-bold text-white hover:bg-blue-500 disabled:opacity-60"
          >
            {submitting ? 'Submitting…' : 'Submit'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleReview} className="rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8 space-y-6">
      <div className="flex items-center gap-2">
        <UserCheck className="h-5 w-5 text-blue-400" />
        <h3 className="text-xl font-bold text-white">Online Membership Application</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Title</label>
          <select
            value={form.title}
            onChange={(e) => update('title', e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs text-white"
          >
            <option value="">Select</option>
            <option>Mr</option>
            <option>Mrs</option>
            <option>Ms</option>
            <option>Dr</option>
            <option>Pastor</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">First Name *</label>
          <input
            type="text"
            required
            value={form.firstName}
            onChange={(e) => update('firstName', e.target.value)}
            placeholder="e.g. John"
            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Last Name *</label>
          <input
            type="text"
            required
            value={form.lastName}
            onChange={(e) => update('lastName', e.target.value)}
            placeholder="e.g. Smith"
            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs text-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Gender *</label>
          <select
            required
            value={form.gender}
            onChange={(e) => update('gender', e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs text-white"
          >
            <option value="">Select</option>
            <option>Male</option>
            <option>Female</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Email *</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            placeholder="john@domain.com"
            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs text-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Mobile Number *</label>
          <div className="flex items-center gap-2">
            <span className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2.5 text-xs text-slate-300">+27</span>
            <input
              type="tel"
              required
              value={form.mobile}
              onChange={(e) => update('mobile', e.target.value)}
              placeholder="82 000 0000"
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs text-white"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Nationality</label>
          <input
            type="text"
            value={form.nationality}
            onChange={(e) => update('nationality', e.target.value)}
            placeholder="e.g. South African"
            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs text-white"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-2">Address *</label>
        <div className="space-y-3">
          <input
            type="text"
            required
            value={form.street}
            onChange={(e) => update('street', e.target.value)}
            placeholder="Street Address"
            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs text-white"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              required
              value={form.city}
              onChange={(e) => update('city', e.target.value)}
              placeholder="City"
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs text-white"
            />
            <input
              type="text"
              required
              value={form.province}
              onChange={(e) => update('province', e.target.value)}
              placeholder="State/Region/Province"
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs text-white"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              required
              value={form.postal}
              onChange={(e) => update('postal', e.target.value)}
              placeholder="Postal / Zip Code"
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs text-white"
            />
            <select
              value={form.country}
              onChange={(e) => update('country', e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs text-white"
            >
              <option>South Africa</option>
              <option>United Kingdom</option>
              <option>United States</option>
              <option>Australia</option>
              <option>Other</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-2">Are You A Member Of Revival Church International?</label>
        <div className="flex items-center gap-4 text-xs text-slate-200">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="isMember"
              value="Yes"
              checked={form.isMember === 'Yes'}
              onChange={() => update('isMember', 'Yes')}
            />
            Yes
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="isMember"
              value="No"
              checked={form.isMember === 'No'}
              onChange={() => update('isMember', 'No')}
            />
            No
          </label>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1">How Did You Hear About Us?</label>
        <select
          value={form.hearAbout}
          onChange={(e) => update('hearAbout', e.target.value)}
          className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs text-white"
        >
          {HEAR_OPTIONS.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
        <label className="flex items-start gap-3 text-xs text-slate-300">
          <input
            type="checkbox"
            required
            checked={form.consent}
            onChange={(e) => update('consent', e.target.checked)}
            className="mt-0.5"
          />
          <span>
            I consent for my information to be taken and processed by Revival Church International. *
          </span>
        </label>
      </div>

      {error && (
        <p role="alert" className="rounded-xl border border-red-500/40 bg-red-950/30 px-3 py-2 text-xs text-red-300">{error}</p>
      )}

      <button
        type="submit"
        className="w-full rounded-xl bg-blue-600 px-5 py-3 text-xs font-bold text-white hover:bg-blue-500"
      >
        Review
      </button>
    </form>
  );
};