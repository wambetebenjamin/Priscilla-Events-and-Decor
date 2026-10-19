/**
 * Storage.
 *
 * Enquiries, bridal bookings, subscribers and the portfolio index live in Vercel
 * KV in production. When the KV environment variables are absent, which is the
 * case in local development and in an unconnected preview, the same interface
 * writes to a file in the system temp directory so nothing is ever lost and the
 * routes still behave the same way.
 *
 * Keys, all namespaced so a shared KV instance stays tidy:
 *   enquiry:<reference>            an event enquiry
 *   enquiry:index                  newest first list of enquiry references
 *   bridal:<reference>             a bridal consultation booking
 *   bridal:index                   newest first list of booking references
 *   subscriber:<sha256(email)>     a newsletter subscriber
 *   subscriber:index               list of subscriber keys
 */

import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

const FALLBACK_DIR = path.join(os.tmpdir(), 'priscilla-events-kv');

function hasKv(): boolean {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

/* --------------------------------------------------------------------------
   Fallback store. A single JSON file, written atomically, so concurrent
   requests cannot corrupt it in the way a naive read plus write can.
   -------------------------------------------------------------------------- */
function fallbackFile(): string {
  return path.join(FALLBACK_DIR, 'store.json');
}

async function readFallback(): Promise<Record<string, unknown>> {
  try {
    const raw = await fs.readFile(fallbackFile(), 'utf8');
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return {};
  }
}

let writeQueue: Promise<unknown> = Promise.resolve();

async function writeFallback(store: Record<string, unknown>): Promise<void> {
  await fs.mkdir(FALLBACK_DIR, { recursive: true });
  const tmp = `${fallbackFile()}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(store, null, 2), 'utf8');
  await fs.rename(tmp, fallbackFile());
}

/* --------------------------------------------------------------------------
   Public interface
   -------------------------------------------------------------------------- */
export async function kvSet(key: string, value: unknown): Promise<void> {
  if (hasKv()) {
    const { kv } = await import('@vercel/kv');
    await kv.set(key, value);
    return;
  }
  writeQueue = writeQueue.then(async () => {
    const store = await readFallback();
    store[key] = value;
    await writeFallback(store);
  });
  await writeQueue;
}

export async function kvGet<T>(key: string): Promise<T | null> {
  if (hasKv()) {
    const { kv } = await import('@vercel/kv');
    const value = await kv.get<T>(key);
    return value ?? null;
  }
  const store = await readFallback();
  return (store[key] as T) ?? null;
}

/**
 * Append a value to a list key and trim it, so an index never grows without
 * bound. Used for the enquiry and booking indexes.
 */
export async function kvAppend(key: string, value: string, cap = 500): Promise<void> {
  if (hasKv()) {
    const { kv } = await import('@vercel/kv');
    await kv.lpush(key, value);
    await kv.ltrim(key, 0, cap - 1);
    return;
  }
  writeQueue = writeQueue.then(async () => {
    const store = await readFallback();
    const list = Array.isArray(store[key]) ? (store[key] as string[]) : [];
    list.unshift(value);
    store[key] = list.slice(0, cap);
    await writeFallback(store);
  });
  await writeQueue;
}

export async function kvList(key: string): Promise<string[]> {
  if (hasKv()) {
    const { kv } = await import('@vercel/kv');
    const list = await kv.lrange<string>(key, 0, -1);
    return list ?? [];
  }
  const store = await readFallback();
  return Array.isArray(store[key]) ? (store[key] as string[]) : [];
}

/** True when the deployment is backed by real Vercel KV. Reported by /api/health. */
export function storageMode(): 'vercel-kv' | 'local-fallback' {
  return hasKv() ? 'vercel-kv' : 'local-fallback';
}

/** Newsletter subscribers are keyed by a hash, never by the raw address. */
export function subscriberKey(email: string): string {
  const hash = createHash('sha256').update(email.trim().toLowerCase()).digest('hex').slice(0, 32);
  return `subscriber:${hash}`;
}
