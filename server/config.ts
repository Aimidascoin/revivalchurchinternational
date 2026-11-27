import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

dotenv.config({ path: path.join(projectRoot, '.env') });

const toPort = (value: string | undefined, fallback: number) => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

const originList = (process.env.ALLOWED_ORIGIN ??
  'https://www.revivalchurchinternational.co.za,https://revivalchurchinternational.co.za,http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

export const config = {
  projectRoot,
  port: toPort(process.env.PORT, 3001),
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
  dataDir: process.env.DATA_DIR
    ? path.resolve(projectRoot, process.env.DATA_DIR)
    : path.join(projectRoot, 'server', 'data'),
  clientDist: path.join(projectRoot, 'dist'),
  apiPrefix: '/api',
  /** Public site URL used for Yoco success/cancel/failure return links. */
  siteUrl: (process.env.SITE_URL ?? 'https://www.revivalchurchinternational.co.za').replace(/\/$/, ''),
  /** Browser origins allowed to call this API (comma-separated). */
  allowedOrigins: originList,
  /** Server-only Yoco credentials. Never expose these in the frontend. */
  yocoSecretKey: process.env.YOCO_SECRET_KEY ?? '',
  yocoWebhookSecret: process.env.YOCO_WEBHOOK_SECRET ?? '',
};
