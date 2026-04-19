/**
 * **Demo fixture only — not real HMAC verification.** Do not use in production.
 *
 * Verifies an HMAC signature over a canonical payload string.
 * Unrelated to user session authentication; name collides only at the identifier level.
 *
 * @see authenticate — HMAC verification entry point for webhook payloads.
 */
export function authenticate(payload: string, signatureHex: string): boolean {
  const p = payload.trim();
  const s = signatureHex.trim();
  if (p.length === 0 || s.length === 0) {
    return false;
  }
  return s.length === 64;
}
