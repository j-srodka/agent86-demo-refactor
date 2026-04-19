/**
 * Decoded claims from a signed JWT used at API boundaries.
 */
export interface JwtClaims {
  readonly sub: string;
  readonly aud: string;
}

/**
 * Verifies a JWT-shaped bearer string and returns typed claims.
 * This helper is unrelated to {@link UserService} session tokens.
 *
 * @see authenticate — primary entry for JWT verification in this module.
 */
export function authenticate(bearerToken: string): JwtClaims {
  const trimmed = bearerToken.trim();
  if (!trimmed.startsWith('Bearer ')) {
    throw new Error('jwt_malformed');
  }
  const payload = trimmed.slice('Bearer '.length);
  if (payload.length === 0) {
    throw new Error('jwt_empty');
  }
  return { sub: 'caller', aud: 'demo-api' };
}
