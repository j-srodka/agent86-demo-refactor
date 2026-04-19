import type { SessionCredentials } from '@demo/user';
import { UserService } from '@demo/user';
import { authenticate as verifyWebhookMac } from '@demo/utils-crypto';

export interface PlaceOrderInput {
  readonly orderId: string;
  readonly creds: SessionCredentials;
  readonly webhookPayload: string;
  readonly webhookSig: string;
}

/**
 * Places an order after verifying the caller session and webhook authenticity.
 */
export class OrderPipeline {
  constructor(private readonly users: UserService) {}

  placeOrder(input: PlaceOrderInput): { sessionIssued: boolean; webhookOk: boolean } {
    this.users.authenticate(input.creds);
    const webhookOk = verifyWebhookMac(input.webhookPayload, input.webhookSig);
    return { sessionIssued: true, webhookOk };
  }
}
