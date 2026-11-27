import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

dotenv.config({ path: path.join(projectRoot, '.env') });

const toPort = (value: string | undefined, fallback: number) => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

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
};
