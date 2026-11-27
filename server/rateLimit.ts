import type { NextFunction, Request, Response } from 'express';

interface Bucket {
  hits: number[];
}

const buckets = new Map<string, Bucket>();

/** Small in-memory limiter; enough to stop accidental form spam without extra services. */
export function rateLimit(max: number, windowMs: number) {
  return (req: Request, res: Response, next: NextFunction) => {
    const key = req.ip ?? req.socket.remoteAddress ?? 'unknown';
    const now = Date.now();
    const bucket = buckets.get(key) ?? { hits: [] };
    bucket.hits = bucket.hits.filter((hit) => now - hit < windowMs);

    if (bucket.hits.length >= max) {
      res.status(429).json({
        ok: false,
        error: 'Too many requests. Please wait a moment and try again.',
      });
      return;
    }

    bucket.hits.push(now);
    buckets.set(key, bucket);
    next();
  };
}
