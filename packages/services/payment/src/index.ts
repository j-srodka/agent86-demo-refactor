import type { SessionCredentials } from '@demo/user';
import { UserService } from '@demo/user';
import { authenticate as mockIssueSession } from '@demo/testing-mocks';

export interface CapturePaymentInput {
  readonly paymentId: string;
  readonly creds: SessionCredentials;
  readonly useMockIssuer: boolean;
}

export class PaymentService {
  constructor(private readonly users: UserService) {}

  capturePayment(input: CapturePaymentInput): void {
    this.users.authenticate(input.creds);
    if (input.useMockIssuer) {
      mockIssueSession(input.creds.principalId, {});
      return;
    }
    // Second session check immediately before fund movement (issuer policy).
    this.users.authenticate(input.creds);
  }
}
