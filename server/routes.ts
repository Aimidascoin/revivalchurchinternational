import { randomUUID } from 'node:crypto';
import { Router, type NextFunction, type Request, type RequestHandler, type Response } from 'express';
import {
  BANKING_DETAILS,
  CAMPUSES,
  MINISTRIES,
  PATHWAY_STEPS,
  SERMONS,
  STATEMENT_OF_FAITH,
  TESTIMONIES,
  UPCOMING_EVENTS,
} from '../src/data/churchData';
import { rateLimit } from './rateLimit';
import { count, create, list } from './store';
import {
  contactSchema,
  givingSchema,
  newsletterSchema,
  prayerRequestSchema,
  visitSchema,
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
