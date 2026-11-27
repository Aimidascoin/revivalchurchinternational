import fs from 'node:fs';
import path from 'node:path';
import cors from 'cors';
import express, { type NextFunction, type Request, type Response } from 'express';
import helmet from 'helmet';
import { config } from './config';
import { apiRouter } from './routes';

export function createApp() {
  const app = express();

  app.disable('x-powered-by');
  app.use(helmet({ crossOriginResourcePolicy: false }));
  app.use(cors({ origin: config.isProduction ? false : true }));
  app.use(express.json({ limit: '128kb' }));

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

if (!config.isTest) {
  const app = createApp();
  app.listen(config.port, '0.0.0.0', () => {
    console.log(`[rci-api] listening on http://localhost:${config.port}${config.apiPrefix}`);
  });
}
