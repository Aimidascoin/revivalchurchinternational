import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto';
import { Router, type NextFunction, type Request, type RequestHandler, type Response } from 'express';
import { config } from './config';
import type { RawBodyRequest } from './index';
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
} from '../src/data/churchData';
import { rateLimit } from './rateLimit';
import { count, create, incrementCounter, list, readCounter } from './store';
import {
  contactSchema,
  givingSchema,
  liveChatSchema,
  liveReactionSchema,
  newsletterSchema,
  prayerRequestSchema,
  visitSchema,
  yocoCheckoutSchema,
} from './validation';

type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;

const asyncRoute = (handler: AsyncHandler): RequestHandler => (req, res, next) => {
  Promise.resolve(handler(req, res, next)).catch(next);
};

const siteContent = {
  campuses: CAMPUSES,
  ministries: MINISTRIES,
  pathway: PATHWAY_STEPS,
  sermons: SERMONS,
  events: UPCOMING_EVENTS,
  testimonies: TESTIMONIES,
  videoTestimonies: VIDEO_TESTIMONIES,
  statementOfFaith: STATEMENT_OF_FAITH,
  bankingDetails: BANKING_DETAILS,
};

const contentByKey: Record<string, unknown> = {
  campuses: CAMPUSES,
  ministries: MINISTRIES,
  pathway: PATHWAY_STEPS,
  sermons: SERMONS,
  events: UPCOMING_EVENTS,
  testimonies: TESTIMONIES,
  'video-testimonies': VIDEO_TESTIMONIES,
  'statement-of-faith': STATEMENT_OF_FAITH,
  'banking-details': BANKING_DETAILS,
};

export const apiRouter = Router();

apiRouter.get('/health', (_req, res) => {
  res.json({
    ok: true,
    data: {
      status: 'healthy',
      uptimeSeconds: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
    },
  });
});

apiRouter.get('/site', (_req, res) => {
  res.json({ ok: true, data: siteContent });
});

apiRouter.get('/content/:key', (req, res) => {
  const data = contentByKey[req.params.key];
  if (data === undefined) {
    res.status(404).json({ ok: false, error: 'Unknown content collection' });
    return;
  }
  res.json({ ok: true, data });
});

apiRouter.get('/campuses', (_req, res) => res.json({ ok: true, data: CAMPUSES }));
apiRouter.get('/ministries', (_req, res) => res.json({ ok: true, data: MINISTRIES }));
apiRouter.get('/sermons', (_req, res) => res.json({ ok: true, data: SERMONS }));
apiRouter.get('/events', (_req, res) => res.json({ ok: true, data: UPCOMING_EVENTS }));
apiRouter.get('/testimonies', (_req, res) => res.json({ ok: true, data: TESTIMONIES }));

const formLimit = rateLimit(8, 60_000);

apiRouter.post('/prayer-requests', formLimit, asyncRoute(async (req, res) => {
  const parsed = prayerRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ ok: false, error: parsed.error.issues[0]?.message ?? 'Invalid request' });
    return;
  }
  const record = await create('prayerRequests', parsed.data);
  res.status(201).json({
    ok: true,
    data: { id: record.id, receivedAt: record.createdAt },
    message: 'Your prayer request has been received. The prayer altar is praying with you.',
  });
}));

apiRouter.post('/visits', formLimit, asyncRoute(async (req, res) => {
  const parsed = visitSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ ok: false, error: parsed.error.issues[0]?.message ?? 'Invalid request' });
    return;
  }
  const record = await create('visits', parsed.data);
  res.status(201).json({
    ok: true,
    data: { id: record.id, receivedAt: record.createdAt },
    message: 'Your visit request is confirmed. Our first-timers team will contact you.',
  });
}));

apiRouter.post('/giving', formLimit, asyncRoute(async (req, res) => {
  const parsed = givingSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ ok: false, error: parsed.error.issues[0]?.message ?? 'Invalid request' });
    return;
  }
  const reference = `RCI-${Date.now().toString(36).toUpperCase()}-${randomUUID().slice(0, 4).toUpperCase()}`;
  const record = await create('giving', { ...parsed.data, reference });
  res.status(201).json({
    ok: true,
    data: {
      id: record.id,
      reference,
      receivedAt: record.createdAt,
      bankingDetails: parsed.data.method === 'bank' ? BANKING_DETAILS : null,
    },
    message: 'Thank you for your giving. Your pledge has been recorded.',
  });
}));

/**
 * Yoco Checkout API. The secret key is read from the server environment and
 * is never returned to the browser. Card details are entered on Yoco's own
 * hosted page, and payment success is confirmed by the signed webhook below.
 */
apiRouter.post('/yoco/checkout', formLimit, asyncRoute(async (req, res) => {
  const parsed = yocoCheckoutSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ ok: false, error: parsed.error.issues[0]?.message ?? 'Invalid request' });
    return;
  }
  if (!config.yocoSecretKey) {
    res.status(503).json({ ok: false, error: 'Online giving is not configured yet. Please use bank EFT.' });
    return;
  }

  const { name, email, fund } = parsed.data;
  const amountInCents = Math.round(parsed.data.amount * 100);
  const reference = `RCI-${Date.now().toString(36).toUpperCase()}-${randomUUID().slice(0, 6).toUpperCase()}`;
  // Yoco redirects inside the checkout iframe. This RCI-owned page breaks
  // the visitor back out to the main site, where the branded receipt shows.
  const returnUrl = (outcome: 'success' | 'cancelled' | 'failed') =>
    `${config.siteUrl}/checkout-complete.html?giving=${outcome}&reference=${encodeURIComponent(reference)}`;

  try {
    const yocoResponse = await fetch('https://payments.yoco.com/api/checkouts', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.yocoSecretKey}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': reference,
      },
      body: JSON.stringify({
        amount: amountInCents,
        currency: 'ZAR',
        successUrl: returnUrl('success'),
        cancelUrl: returnUrl('cancelled'),
        failureUrl: returnUrl('failed'),
        metadata: {
          reference,
          fund,
          donorName: name,
          donorEmail: email,
          source: 'rci_website',
        },
        lineItems: [
          {
            displayName: `RCI Giving — ${fund}`,
            quantity: 1,
            pricingDetails: { price: amountInCents },
          },
        ],
      }),
    });

    const checkout = (await yocoResponse.json().catch(() => ({}))) as {
      id?: string;
      redirectUrl?: string;
      status?: string;
      message?: string;
      error?: string;
    };

    if (!yocoResponse.ok || !checkout.redirectUrl || !checkout.id) {
      console.error('[yoco] checkout creation failed', yocoResponse.status, checkout.message ?? checkout.error);
      res.status(502).json({
        ok: false,
        error: 'We could not start secure payment right now. Please try again or use bank EFT.',
      });
      return;
    }

    res.json({
      ok: true,
      data: {
        reference,
        checkoutId: checkout.id,
        redirectUrl: checkout.redirectUrl,
        amount: parsed.data.amount,
        currency: 'ZAR',
        fund,
        name,
        email,
      },
      message: 'Continue on the secure RCI checkout page to complete your gift.',
    });
  } catch (error) {
    console.error('[yoco] checkout error', error);
    res.status(502).json({ ok: false, error: 'We could not reach the payment provider. Please try again.' });
  }
}));

/** Signed Yoco webhook: the authoritative record that a payment succeeded. */
apiRouter.post('/yoco/webhook', asyncRoute(async (req, res) => {
  const header = (name: string) => {
    const value = req.headers[name];
    return Array.isArray(value) ? value[0] : value;
  };
  const webhookId = header('webhook-id');
  const timestamp = header('webhook-timestamp');
  const signatureHeader = header('webhook-signature');
  const secret = config.yocoWebhookSecret;

  if (!secret || !webhookId || !timestamp || !signatureHeader) {
    res.status(401).json({ ok: false, error: 'Missing webhook credentials' });
    return;
  }

  const sentAt = Number(timestamp);
  if (!Number.isFinite(sentAt) || Math.abs(Date.now() / 1000 - sentAt) > 180) {
    res.status(401).json({ ok: false, error: 'Stale webhook timestamp' });
    return;
  }

  const rawBody = (req as RawBodyRequest).rawBody ?? JSON.stringify(req.body ?? {});
  const signedContent = `${webhookId}.${timestamp}.${rawBody}`;
  const secretBytes = Buffer.from(secret.replace(/^whsec_/, ''), 'base64');
  const expected = createHmac('sha256', secretBytes).update(signedContent).digest('base64');
  const candidates = signatureHeader
    .split(' ')
    .map((part) => part.split(',')[1])
    .filter((part): part is string => Boolean(part));
  const isValid = candidates.some((candidate) => {
    const supplied = Buffer.from(candidate);
    const computed = Buffer.from(expected);
    return supplied.length === computed.length && timingSafeEqual(supplied, computed);
  });

  if (!isValid) {
    res.status(403).json({ ok: false, error: 'Invalid webhook signature' });
    return;
  }

  const event = req.body as {
    type?: string;
    id?: string;
    payload?: { metadata?: { reference?: string }; status?: string; amount?: number };
  };
  if (event.type === 'payment.succeeded') {
    // Webhook is the source of truth. Replace this log with ledger/email
    // fulfillment when those services are connected.
    console.log('[yoco] payment.succeeded', {
      eventId: event.id,
      reference: event.payload?.metadata?.reference ?? null,
      amount: event.payload?.amount ?? null,
    });
  }

  res.json({ ok: true });
}));

apiRouter.post('/contact', formLimit, asyncRoute(async (req, res) => {
  const parsed = contactSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ ok: false, error: parsed.error.issues[0]?.message ?? 'Invalid request' });
    return;
  }
  const record = await create('contacts', parsed.data);
  res.status(201).json({
    ok: true,
    data: { id: record.id, receivedAt: record.createdAt },
    message: 'Thank you for reaching out. We will reply shortly.',
  });
}));

apiRouter.post('/newsletter', formLimit, asyncRoute(async (req, res) => {
  const parsed = newsletterSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ ok: false, error: parsed.error.issues[0]?.message ?? 'Invalid request' });
    return;
  }
  const email = parsed.data.email.toLowerCase();
  const existing = await list('newsletter');
  if (existing.some((item) => typeof item.email === 'string' && item.email.toLowerCase() === email)) {
    res.json({ ok: true, message: 'You are already on the prayer newsletter list.' });
    return;
  }
  await create('newsletter', { email });
  res.status(201).json({ ok: true, message: 'You have joined the RCI prayer newsletter.' });
}));

// Live service interaction: chat, viewer reactions and aggregate stats.
const chatLimit = rateLimit(20, 60_000);
const MAX_CHAT_HISTORY = 200;

apiRouter.get('/live/chat', asyncRoute(async (req, res) => {
  const after = typeof req.query.after === 'string' ? req.query.after : '';
  const messages = await list('liveChat');
  const index = after ? messages.findIndex((message) => message.id === after) : -1;
  // Unknown cursor means the client is out of sync — resync with recent history.
  const tail = index >= 0 ? messages.slice(index + 1) : messages.slice(-MAX_CHAT_HISTORY);
  res.json({ ok: true, data: tail });
}));

apiRouter.post('/live/chat', chatLimit, asyncRoute(async (req, res) => {
  const parsed = liveChatSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ ok: false, error: parsed.error.issues[0]?.message ?? 'Invalid message' });
    return;
  }
  const record = await create('liveChat', {
    ...parsed.data,
    location: parsed.data.location?.trim() || 'Online Viewer',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  });
  res.status(201).json({ ok: true, data: record });
}));

apiRouter.get('/live/stats', asyncRoute(async (_req, res) => {
  const [amens, messages] = await Promise.all([readCounter('amen'), count('liveChat')]);
  res.json({ ok: true, data: { amens, messages } });
}));

apiRouter.post('/live/react', chatLimit, asyncRoute(async (req, res) => {
  const parsed = liveReactionSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ ok: false, error: 'Unsupported reaction' });
    return;
  }
  const [amens, messages] = await Promise.all([incrementCounter('amen'), count('liveChat')]);
  res.status(201).json({ ok: true, data: { amens, messages } });
}));

apiRouter.get('/stats', asyncRoute(async (_req, res) => {
  const [prayerRequests, visits, giving, contacts, newsletter] = await Promise.all([
    count('prayerRequests'),
    count('visits'),
    count('giving'),
    count('contacts'),
    count('newsletter'),
  ]);
  res.json({ ok: true, data: { prayerRequests, visits, giving, contacts, newsletter } });
}));
