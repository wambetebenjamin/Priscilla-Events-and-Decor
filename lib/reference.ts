/**
 * Reference numbers.
 *
 * Every submission gets one, and it is shown to the client, sent by email and
 * quoted on WhatsApp. The format is deliberate: a prefix the team can read at a
 * glance, the Kenyan date, and four random characters so two enquiries on the
 * same day cannot collide.
 *
 *   PE-E-260214-7K2Q   event enquiry
 *   PE-B-260214-3XA9   bridal consultation
 *   PE-C-260214-M40T   contact message
 *   PE-N-260214-B81V   newsletter subscriber
 */

import { randomBytes } from 'node:crypto';

const PREFIX = 'PE';

const KIND_CODE = {
  enquiry: 'E',
  bridal: 'B',
  contact: 'C',
  newsletter: 'N',
} as const;

export type ReferenceKind = keyof typeof KIND_CODE;

/** Unambiguous alphabet: no O or 0, no I or 1, no S or 5. */
const ALPHABET = 'ABCDEFGHJKLMNPQRTUVWXYZ2346789';

function randomSuffix(length = 4): string {
  const bytes = randomBytes(length);
  let out = '';
  for (let i = 0; i < length; i += 1) {
    out += ALPHABET[bytes[i] % ALPHABET.length];
  }
  return out;
}

/** YYMMDD in Nairobi time, which is UTC+3 year round. */
function nairobiDateStamp(date = new Date()): string {
  const nairobi = new Date(date.getTime() + 3 * 60 * 60 * 1000);
  const year = String(nairobi.getUTCFullYear()).slice(2);
  const month = String(nairobi.getUTCMonth() + 1).padStart(2, '0');
  const day = String(nairobi.getUTCDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

export function makeReference(kind: ReferenceKind, date = new Date()): string {
  return `${PREFIX}-${KIND_CODE[kind]}-${nairobiDateStamp(date)}-${randomSuffix()}`;
}

/** Validates a reference the way the team would type it back in. */
export function isReference(value: string): boolean {
  return /^PE-[EBCN]-\d{6}-[A-Z2-9]{4}$/.test(value.trim().toUpperCase());
}
