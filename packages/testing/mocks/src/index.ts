import type { SessionToken } from '@demo/user';

export interface MockAuthOptions {
  readonly failNext?: boolean;
}

/**
 * Test double that mimics session issuance without touching real credentials.
 */
export function authenticate(
  principalId: string,
  options: MockAuthOptions = {},
): SessionToken {
  if (options.failNext === true) {
    throw new Error('mock_auth_failure');
  }
  return { token: `mock_${principalId}`, expiresAtEpochMs: 0 };
}

/** Shared test setup: returns a token issued through the mock issuer. */
export function createAuthenticatedContext(principalId: string, options: MockAuthOptions = {}): SessionToken {
  return authenticate(principalId, options);
}
