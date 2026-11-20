import 'server-only';
import { randomBytes, randomInt } from 'node:crypto';

// Crockford-style alphabet without look-alike characters (no 0/O, 1/I/L), safe to read aloud at a counter.
const ALPHABET = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';

export function shortCode(len = 6) {
  let s = '';
  for (let i = 0; i < len; i++) s += ALPHABET[randomInt(ALPHABET.length)];
  return s;
}

/** Unguessable token used in badge URLs, so personal details can't be enumerated. */
export function urlToken() {
  return randomBytes(16).toString('base64url');
}
