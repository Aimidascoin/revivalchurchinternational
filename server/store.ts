import { randomUUID } from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { config } from './config';

export type CollectionName =
  | 'prayerRequests'
  | 'visits'
  | 'giving'
  | 'contacts'
  | 'newsletter';

export interface StoredRecord {
  id: string;
  createdAt: string;
  [key: string]: unknown;
}

const fileFor = (collection: CollectionName) =>
  path.join(config.dataDir, `${collection}.json`);

// Serialize writes per collection so two simultaneous requests cannot lose data.
const queues = new Map<CollectionName, Promise<unknown>>();

const withQueue = <T>(collection: CollectionName, task: () => Promise<T>): Promise<T> => {
  const previous = queues.get(collection) ?? Promise.resolve();
  const next = previous.then(task, task);
  queues.set(collection, next);
  return next.finally(() => {
    if (queues.get(collection) === next) queues.delete(collection);
  });
};

const ensureDataDir = () => fs.mkdir(config.dataDir, { recursive: true });

export async function list<T extends StoredRecord = StoredRecord>(
  collection: CollectionName,
): Promise<T[]> {
  await ensureDataDir();
  try {
    const raw = await fs.readFile(fileFor(collection), 'utf8');
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return [];
    throw error;
  }
}

export async function create<T extends Record<string, unknown>>(
  collection: CollectionName,
  values: T,
): Promise<StoredRecord & T> {
  return withQueue(collection, async () => {
    const records = await list(collection);
    const record: StoredRecord & T = {
      id: randomUUID(),
      createdAt: new Date().toISOString(),
      ...values,
    };
    records.push(record);

    const file = fileFor(collection);
    const temporary = `${file}.${process.pid}.tmp`;
    await fs.writeFile(temporary, JSON.stringify(records, null, 2), 'utf8');
    await fs.rename(temporary, file);
    return record;
  });
}

export async function count(collection: CollectionName): Promise<number> {
  return (await list(collection)).length;
}
