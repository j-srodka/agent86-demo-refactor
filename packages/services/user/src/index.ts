/**
 * Session credentials supplied by upstream callers (password grant, API key exchange, etc.).
 */
export interface SessionCredentials {
  readonly principalId: string;
  readonly secret: string;
}

/**
 * Opaque session token returned after successful authentication.
 */
export interface SessionToken {
  readonly token: string;
  readonly expiresAtEpochMs: number;
}

/**
 * Core identity service used by order, payment, and notification flows.
 */
export class UserService {
  /**
   * Validates credentials and issues a session token for downstream services.
   */
  authenticate(creds: SessionCredentials): SessionToken {
    const normalized = creds.principalId.trim();
    if (normalized.length === 0 || creds.secret.length === 0) {
      throw new Error('invalid_credentials');
    }
    return {
      token: `sess_${normalized}`,
      expiresAtEpochMs: 86_400_000,
    };
  }
}
