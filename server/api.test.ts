import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import type { Server } from 'node:http';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { after, before, describe, it } from 'node:test';

let server: Server;
let api = '';
let dataDir = '';

const post = (route: string, body: unknown) =>
  fetch(`${api}${route}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });

before(async () => {
  process.env.NODE_ENV = 'test';
  dataDir = await mkdtemp(path.join(tmpdir(), 'rci-api-test-'));
  process.env.DATA_DIR = dataDir;

  const { createApp } = await import('./index');
  server = createApp().listen(0, '127.0.0.1');
  await new Promise<void>((resolve) => server.once('listening', resolve));
  const address = server.address();
  const port = typeof address === 'object' && address ? address.port : 0;
  api = `http://127.0.0.1:${port}/api`;
});

after(async () => {
  await new Promise<void>((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
  await rm(dataDir, { recursive: true, force: true });
});

describe('RCI API', () => {
  it('reports health', async () => {
    const response = await fetch(`${api}/health`);
    const body = await response.json();
    assert.equal(response.status, 200);
    assert.equal(body.data.status, 'healthy');
  });

  it('serves site content from a single source of truth', async () => {
    const response = await fetch(`${api}/site`);
    const body = await response.json();
    assert.equal(body.data.campuses.length, 6);
    assert.equal(body.data.sermons.length, 4);
  });

  it('accepts and validates prayer requests', async () => {
    const invalid = await post('/prayer-requests', { name: 'A', details: 'short' });
    assert.equal(invalid.status, 400);

    const valid = await post('/prayer-requests', {
      name: 'Nomsa Dlamini',
      email: 'nomsa@example.com',
      category: 'Healing',
      details: 'Please pray for my family during this season.',
    });
    const body = await valid.json();
    assert.equal(valid.status, 201);
    assert.ok(body.data.id);
  });

  it('rejects an unknown campus on visit booking', async () => {
    const response = await post('/visits', {
      name: 'John Smith',
      email: 'john@example.com',
      campusId: 'not-a-campus',
      serviceDate: '2026-12-06',
      serviceTime: '09:00 AM',
    });
    assert.equal(response.status, 400);
  });

  it('records giving with a reference number', async () => {
    const response = await post('/giving', {
      name: 'Samuel Test',
      email: 'samuel@example.com',
      amount: 250,
      currency: 'ZAR',
      fund: 'Legacy Vision Fund',
      method: 'bank',
    });
    const body = await response.json();
    assert.equal(response.status, 201);
    assert.match(body.data.reference, /^RCI-/);
    assert.ok(body.data.bankingDetails);
  });

  it('does not duplicate newsletter signups', async () => {
    const payload = { email: 'member@example.com' };
    const first = await post('/newsletter', payload);
    const second = await post('/newsletter', payload);
    assert.equal(first.status, 201);
    assert.equal(second.status, 200);
    assert.match((await second.json()).message, /already/);
  });

  it('returns a JSON 404 for unknown API routes', async () => {
    const response = await fetch(`${api}/does-not-exist`);
    assert.equal(response.status, 404);
    assert.equal((await response.json()).ok, false);
  });
});
