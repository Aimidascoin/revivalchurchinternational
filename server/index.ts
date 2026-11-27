import fs from 'node:fs';
import path from 'node:path';
import cors from 'cors';
import express, { type NextFunction, type Request, type Response } from 'express';
import helmet from 'helmet';
import { config } from './config';
import { apiRouter } from './routes';

export type RawBodyRequest = Request & { rawBody?: string };

export function createApp() {
  const app = express();

  app.disable('x-powered-by');
  app.use(helmet({ crossOriginResourcePolicy: false }));
  app.use(
    cors({
      origin: config.allowedOrigins.includes('*') ? true : config.allowedOrigins,
    }),
  );
  // Keep the untouched body so webhook HMAC verification can use it.
  app.use(
    express.json({
      limit: '128kb',
      verify: (req, _res, buffer) => {
        (req as RawBodyRequest).rawBody = buffer.toString('utf8');
      },
    }),
  );

  app.use(config.apiPrefix, apiRouter);
  app.use(config.apiPrefix, (_req, res) => {
    res.status(404).json({ ok: false, error: 'API endpoint not found' });
  });

  if (config.isProduction && fs.existsSync(path.join(config.clientDist, 'index.html'))) {
    app.use(express.static(config.clientDist, { index: false }));
    app.get('*', (_req, res) => res.sendFile(path.join(config.clientDist, 'index.html')));
  }

  app.use((error: Error & { status?: number }, _req: Request, res: Response, _next: NextFunction) => {
    const status = error.status ?? (error instanceof SyntaxError ? 400 : 500);
    if (status >= 500) console.error('[api]', error);
    res.status(status).json({
      ok: false,
      error: status >= 500 ? 'Internal server error' : error.message,
    });
  });

  return app;
}

// On Vercel the exported app is invoked by the serverless runtime; do not
// open a local listener there.
if (!config.isTest && process.env.VERCEL !== '1') {
  const app = createApp();
  app.listen(config.port, '0.0.0.0', () => {
    console.log(`[rci-api] listening on http://localhost:${config.port}${config.apiPrefix}`);
  });
}
