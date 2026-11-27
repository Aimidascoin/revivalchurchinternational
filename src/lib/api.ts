import {
  BANKING_DETAILS,
  CAMPUSES,
  MINISTRIES,
  PATHWAY_STEPS,
  SERMONS,
  STATEMENT_OF_FAITH,
  TESTIMONIES,
  UPCOMING_EVENTS,
  VIDEO_TESTIMONIES,
  type Campus,
  type Ministry,
  type Sermon,
} from '../data/churchData';

export interface SiteContent {
  campuses: Campus[];
  ministries: Ministry[];
  sermons: Sermon[];
  pathway: typeof PATHWAY_STEPS;
  events: typeof UPCOMING_EVENTS;
  testimonies: typeof TESTIMONIES;
  videoTestimonies: typeof VIDEO_TESTIMONIES;
  statementOfFaith: typeof STATEMENT_OF_FAITH;
  bankingDetails: typeof BANKING_DETAILS;
}

export const localSiteContent: SiteContent = {
  campuses: CAMPUSES,
  ministries: MINISTRIES,
  sermons: SERMONS,
  pathway: PATHWAY_STEPS,
  events: UPCOMING_EVENTS,
  testimonies: TESTIMONIES,
  videoTestimonies: VIDEO_TESTIMONIES,
  statementOfFaith: STATEMENT_OF_FAITH,
  bankingDetails: BANKING_DETAILS,
};

export interface ApiResponse<T> {
  ok: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PrayerPayload {
  name: string;
  email?: string;
  phone?: string;
  campus?: string;
  category: string;
  details: string;
  isPublic?: boolean;
}

export interface VisitPayload {
  name: string;
  email: string;
  phone?: string;
  campusId: string;
  serviceDate: string;
  serviceTime: string;
  guests: number;
  needsParking?: boolean;
  notes?: string;
}

export interface GivingPayload {
  name: string;
  email: string;
  amount: number;
  currency: 'ZAR' | 'USD' | 'GBP';
  fund: string;
  method: 'bank' | 'online';
  note?: string;
}

export interface GivingResult {
  id: string;
  reference: string;
  receivedAt: string;
  bankingDetails: typeof BANKING_DETAILS | null;
}

const baseUrl = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') || '/api';

async function request<T>(path: string, init?: RequestInit): Promise<ApiResponse<T>> {
  let response: Response;
  try {
    response = await fetch(`${baseUrl}${path}`, {
      ...init,
      headers: {
        ...(init?.body ? { 'content-type': 'application/json' } : {}),
        ...init?.headers,
      },
    });
  } catch {
    throw new Error('Cannot reach the server. Please check your connection and try again.');
  }

  const body = (await response.json().catch(() => ({}))) as ApiResponse<T>;
  if (!response.ok || body.ok === false) {
    throw new Error(body.error || body.message || `Request failed (${response.status})`);
  }
  return body;
}

const post = <T>(path: string, payload: unknown) =>
  request<T>(path, { method: 'POST', body: JSON.stringify(payload) });

export const api = {
  site: () => request<SiteContent>('/site'),
  prayerRequest: (payload: PrayerPayload) =>
    post<{ id: string; receivedAt: string }>('/prayer-requests', payload),
  visit: (payload: VisitPayload) => post<{ id: string; receivedAt: string }>('/visits', payload),
  giving: (payload: GivingPayload) => post<GivingResult>('/giving', payload),
  contact: (payload: { name: string; email: string; subject: string; message: string }) =>
    post<{ id: string; receivedAt: string }>('/contact', payload),
  newsletter: (email: string) => post<Record<string, never>>('/newsletter', { email }),
};

/** Maps the UI's campus label or name to the id expected by the API. */
export const campusIdFor = (label: string) => {
  const match = CAMPUSES.find(
    (campus) => campus.id === label || campus.name === label || label.startsWith(campus.name.split(' (')[0]),
  );
  return match?.id ?? CAMPUSES[0].id;
};

/** Converts relative service labels shown in the UI to an ISO date for the API. */
export const serviceDateFor = (label: string) => {
  const today = new Date();
  const targetDay = label.toLowerCase().includes('wednesday') ? 3 : 0;
  const daysToTarget = (targetDay - today.getDay() + 7) % 7;
  const extraWeek = label.toLowerCase().includes('next') ? 7 : 0;
  const wantsTwoWeeks = /later|2 weeks|two weeks/i.test(label);
  const offset = wantsTwoWeeks ? 14 : daysToTarget + extraWeek;
  const date = new Date(today);
  date.setDate(today.getDate() + offset);
  return date.toISOString().slice(0, 10);
};

export const errorMessage = (error: unknown) =>
  error instanceof Error ? error.message : 'Something went wrong. Please try again.';
