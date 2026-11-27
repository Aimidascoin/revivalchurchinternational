import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto';
import type { IncomingMessage, ServerResponse } from 'node:http';
import cors from 'cors';
import express, { type NextFunction, type Request, type Response } from 'express';
import helmet from 'helmet';

type RawBodyRequest = Request & { rawBody?: string };

const siteUrl = (process.env.SITE_URL ?? 'https://www.revivalchurchinternational.co.za').replace(/\/$/, '');
const allowedOrigins = (process.env.ALLOWED_ORIGIN ??
  'https://www.revivalchurchinternational.co.za,https://revivalchurchinternational.co.za,http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
const yocoSecretKey = process.env.YOCO_SECRET_KEY ?? '';
const yocoWebhookSecret = process.env.YOCO_WEBHOOK_SECRET ?? '';

const app = express();
app.disable('x-powered-by');
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({ origin: allowedOrigins.includes('*') ? true : allowedOrigins }));
app.use(
  express.json({
    limit: '128kb',
    verify: (req, _res, buffer) => {
      (req as RawBodyRequest).rawBody = buffer.toString('utf8');
    },
  }),
);

const asyncRoute =
  (handler: (req: Request, res: Response) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(handler(req, res)).catch(next);
  };

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    data: {
      status: 'healthy',
      yocoConfigured: Boolean(yocoSecretKey),
      timestamp: new Date().toISOString(),
    },
  });
});

/** Create a Yoco Checkout session. Secret key stays entirely server-side. */
app.post(
  '/api/yoco/checkout',
  asyncRoute(async (req, res) => {
    const { name, email, fund, amount } = (req.body ?? {}) as {
      name?: string;
      email?: string;
      fund?: string;
      amount?: number;
    };
    const value = Number(amount);

    if (
      (name !== undefined && (typeof name !== 'string' || name.trim().length > 120)) ||
      (email !== undefined && (typeof email !== 'string' || email.trim().length > 160)) ||
      typeof fund !== 'string' || fund.trim().length < 2 ||
      !Number.isFinite(value) || value <= 0 || value > 1_000_000
    ) {
      res.status(400).json({ ok: false, error: 'Please check your giving details and amount.' });
      return;
    }
    if (!yocoSecretKey) {
      res.status(503).json({ ok: false, error: 'Online giving is not configured yet. Please use bank EFT.' });
      return;
    }

    const amountInCents = Math.round(value * 100);
    const reference = `RCI-${Date.now().toString(36).toUpperCase()}-${randomUUID().slice(0, 6).toUpperCase()}`;
    // Yoco redirects inside the checkout iframe. This RCI-owned page breaks
    // the visitor back out to the main site, where the branded receipt shows.
    const returnUrl = (outcome: 'success' | 'cancelled' | 'failed') =>
      `${siteUrl}/checkout-complete.html?giving=${outcome}&reference=${encodeURIComponent(reference)}`;

    try {
      const yocoResponse = await fetch('https://payments.yoco.com/api/checkouts', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${yocoSecretKey}`,
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
            fund: fund.trim(),
            donorName: (name ?? '').trim(),
            donorEmail: (email ?? '').trim(),
            source: 'rci_website',
          },
          lineItems: [
            {
              displayName: `RCI Giving — ${fund.trim()}`,
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
          amount: value,
          currency: 'ZAR',
          fund: fund.trim(),
          name: (name ?? '').trim(),
          email: (email ?? '').trim(),
        },
        message: 'Continue on the secure RCI checkout page to complete your gift.',
      });
    } catch (error) {
      console.error('[yoco] checkout error', error);
      res.status(502).json({ ok: false, error: 'We could not reach the payment provider. Please try again.' });
    }
  }),
);

/** Signed Yoco webhook — the authoritative record that a payment succeeded. */
app.post(
  '/api/yoco/webhook',
  asyncRoute(async (req, res) => {
    const header = (name: string) => {
      const value = req.headers[name];
      return Array.isArray(value) ? value[0] : value;
    };
    const webhookId = header('webhook-id');
    const timestamp = header('webhook-timestamp');
    const signatureHeader = header('webhook-signature');

    if (!yocoWebhookSecret || !webhookId || !timestamp || !signatureHeader) {
      res.status(401).json({ ok: false, error: 'Missing webhook credentials' });
      return;
    }

    const sentAt = Number(timestamp);
    if (!Number.isFinite(sentAt) || Math.abs(Date.now() / 1000 - sentAt) > 180) {
      res.status(401).json({ ok: false, error: 'Stale webhook timestamp' });
      return;
    }

    const rawBody = (req as RawBodyRequest).rawBody ?? JSON.stringify(req.body ?? {});
    const expected = createHmac('sha256', Buffer.from(yocoWebhookSecret.replace(/^whsec_/, ''), 'base64'))
      .update(`${webhookId}.${timestamp}.${rawBody}`)
      .digest('base64');
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
      console.log('[yoco] payment.succeeded', {
        eventId: event.id,
        reference: event.payload?.metadata?.reference ?? null,
        amount: event.payload?.amount ?? null,
      });
    }

    res.json({ ok: true });
  }),
);

/** Resolve the current (or most recent) YouTube broadcast for the RCI channel. */
app.get(
  '/api/youtube/live',
  asyncRoute(async (_req, res) => {
    const channelId = 'UCbGifC5lu_2eGkA1SUfryUQ';
    let ids: string[] = [];
    try {
      const rss = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
      });
      const xml = await rss.text();
      const re = /<yt:videoId>([^<]+)<\/yt:videoId>/g;
      const matches = xml.match(re) || [];
      const parsed = matches.map((m) => {
        const mm = m.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
        return mm ? mm[1] : null;
      });
      const cleaned = parsed.filter((x) => Boolean(x)) as string[];
      ids = [...new Set(cleaned)].slice(0, 6);
    } catch {
      /* ignore and fall back below */
    }

    const envId = (process.env.VITE_YOUTUBE_LIVE_ID || '').trim();
    if (ids.length === 0 && envId) ids = [envId];

    let videoId = ids[0] || envId || '';
    let isLive = false;
    let title: string | null = null;
    let viewers: number | null = null;

    for (const id of ids) {
      try {
        const response = await fetch('https://www.youtube.com/youtubei/v1/player?prettyPrint=false', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            context: { client: { clientName: 'WEB', clientVersion: '2.20250101.01.00' } },
            videoId: id,
          }),
        });
        if (!response.ok) continue;
        const payload = (await response.json()) as {
          videoDetails?: { title?: string; isLive?: boolean };
          microformat?: {
            playerMicroformatRenderer?: {
              liveBroadcastDetails?: { isLiveNow?: boolean; concurrentViewers?: string };
            };
          };
        };
        if (!title) title = payload.videoDetails?.title ?? null;
        const live =
          payload.videoDetails?.isLive === true ||
          payload.microformat?.playerMicroformatRenderer?.liveBroadcastDetails?.isLiveNow === true;
        if (live) {
          videoId = id;
          isLive = true;
          title = payload.videoDetails?.title ?? title;
          const raw = Number(payload.microformat?.playerMicroformatRenderer?.liveBroadcastDetails?.concurrentViewers);
          viewers = Number.isFinite(raw) ? raw : null;
          break;
        }
      } catch {
        /* try the next candidate */
      }
    }

    if (!videoId && envId) videoId = envId;

    res.json({
      ok: true,
      data: { videoId, isLive, title, viewers, degraded: false },
    });
  }),
);

app.use('/api', (_req, res) => res.status(404).json({ ok: false, error: 'API endpoint not found' }));
app.use((error: Error & { status?: number }, _req: Request, res: Response, _next: NextFunction) => {
  const status = error.status ?? (error instanceof SyntaxError ? 400 : 500);
  if (status >= 500) console.error('[api]', error);
  res.status(status).json({ ok: false, error: status >= 500 ? 'Internal server error' : error.message });
});

/** Vercel serverless entry point for the RCI API. */
export default async function handler(req: IncomingMessage, res: ServerResponse) {
  return app(req, res);
}
