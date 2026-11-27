import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Check, Send } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import { api, errorMessage } from '../lib/api';
import { useToast } from './Toast';

export const EventsSection: React.FC = () => {
  const { content } = useContent();
  const toast = useToast();
  const [busy, setBusy] = useState('');
  const [registered, setRegistered] = useState<string[]>([]);
  const [error, setError] = useState('');

  if (content.events.length === 0) return null;

  const register = async (title: string) => {
    if (busy) return;
    setError('');
    setBusy(title);
    try {
      await api.contact({
        name: 'Event Registration',
        email: 'events@revivalchurchintl.org',
        subject: `Event Registration — ${title}`,
        message: `I would like to register my interest for ${title}. Please send me the details.`,
      });
      setRegistered((current) => [...current, title]);
      toast(`Your interest in ${title} has been recorded.`);
    } catch (cause) {
      const message = errorMessage(cause);
      setError(message);
      toast(message, 'error');
    } finally {
      setBusy('');
    }
  };

  return (
    <section id="events" className="relative py-20 bg-slate-900 border-t border-slate-800 overflow-hidden">
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-blue-400">
              Gatherings &amp; Encounters
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-white text-balance sm:text-4xl">
              Conferences &amp; Upcoming Events
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
              Mark your calendar for life-defining gatherings, prophetic summits, and nights of divine encounter.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-yellow-300/30 bg-slate-950 px-6 py-4 text-yellow-300">
            <Calendar className="h-5 w-5 shrink-0" />
            <span className="text-lg font-extrabold uppercase tracking-widest sm:text-xl">COMING SOON</span>
          </div>
        </div>

        {error && (
          <p role="alert" className="mb-5 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2 text-xs text-red-300">
            {error}
          </p>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          {content.events.map((event) => {
            const done = registered.includes(event.title);
            return (
              <article key={event.id} className="flex flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-950/80 p-6 shadow-lg sm:p-7">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-lg bg-blue-950 px-2 py-1 font-mono text-[11px] font-bold uppercase text-blue-300">
                    {event.category}
                  </span>
                  {event.featured && (
                    <span className="rounded-lg bg-amber-500/15 px-2 py-1 text-[11px] font-bold uppercase text-amber-300">
                      Featured
                    </span>
                  )}
                  {event.registrationOpen && (
                    <span className="rounded-lg bg-emerald-500/15 px-2 py-1 text-[11px] font-bold uppercase text-emerald-300">
                      Registration open
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white">{event.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-300 sm:text-sm">{event.description}</p>
                </div>

                <div className="space-y-1.5 text-xs text-slate-400">
                  <p className="flex items-center gap-2"><Calendar className="h-3.5 w-3.5 text-blue-400" />{event.date}</p>
                  <p className="flex items-center gap-2"><Clock className="h-3.5 w-3.5 text-blue-400" />{event.time}</p>
                  <p className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-blue-400" />{event.location}</p>
                </div>

                {event.registrationOpen && (
                  <button
                    type="button"
                    disabled={done || busy === event.title}
                    onClick={() => register(event.title)}
                    className="mt-auto flex w-fit items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {done ? <Check className="h-4 w-4" /> : <Send className="h-4 w-4" />}
                    {done ? 'Interest Recorded' : busy === event.title ? 'Sending…' : 'Register Interest'}
                  </button>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
