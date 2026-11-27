import { z } from 'zod';
import { CAMPUSES } from '../src/data/churchData';

const optionalEmail = z.union([z.string().trim().email().max(160), z.literal('')]).optional();
const optionalPhone = z.string().trim().max(40).optional();
const name = z.string().trim().min(2, 'Please enter your full name').max(120);
const email = z.string().trim().email('Please enter a valid email address').max(160);
const message = z.string().trim().min(10, 'Please add a little more detail').max(3000);

const campusIds = CAMPUSES.map((campus) => campus.id) as [string, ...string[]];

export const prayerRequestSchema = z.object({
  name,
  email: optionalEmail,
  phone: optionalPhone,
  category: z.string().trim().min(2).max(80),
  campus: z.string().trim().max(120).optional(),
  details: message,
  isPublic: z.boolean().optional().default(false),
});

export const visitSchema = z.object({
  name,
  email,
  phone: optionalPhone,
  campusId: z.enum(campusIds, { errorMap: () => ({ message: 'Please choose a valid campus' }) }),
  serviceDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Please choose a valid date'),
  serviceTime: z.string().trim().min(2).max(60),
  guests: z.coerce.number().int().min(1).max(30).default(1),
  needsParking: z.boolean().optional().default(false),
  notes: z.string().trim().max(1000).optional(),
});

export const givingSchema = z.object({
  name,
  email,
  amount: z.coerce.number().positive('Amount must be greater than zero').max(1000000),
  currency: z.enum(['ZAR', 'USD', 'GBP']).default('ZAR'),
  fund: z.string().trim().min(2).max(120),
  method: z.enum(['bank', 'online']).default('bank'),
  note: z.string().trim().max(1000).optional(),
});

/** Yoco Checkout API only supports South African Rand. */
export const yocoCheckoutSchema = z.object({
  name: z.string().trim().max(120).optional(),
  email: optionalEmail,
  amount: z.coerce.number().positive('Amount must be greater than zero').max(1000000),
  fund: z.string().trim().min(2).max(120),
  currency: z.literal('ZAR').default('ZAR'),
});

export const contactSchema = z.object({
  name,
  email,
  subject: z.string().trim().min(2).max(160),
  message,
});

export const newsletterSchema = z.object({
  email,
});

export const liveChatSchema = z.object({
  sender: z.string().trim().min(1, 'Please enter a name').max(60),
  location: z.string().trim().max(60).optional(),
  text: z.string().trim().min(1, 'Please enter a message').max(500),
});

export const liveReactionSchema = z.object({
  type: z.enum(['amen']),
});

export type PrayerRequestInput = z.infer<typeof prayerRequestSchema>;
export type VisitInput = z.infer<typeof visitSchema>;
export type GivingInput = z.infer<typeof givingSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type NewsletterInput = z.infer<typeof newsletterSchema>;
export type LiveChatInput = z.infer<typeof liveChatSchema>;
