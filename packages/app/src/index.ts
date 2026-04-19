import type { SessionCredentials } from '@demo/user';
import { UserService } from '@demo/user';
import { OrderPipeline } from '@demo/order';
import { PaymentService } from '@demo/payment';
import { NotificationService } from '@demo/notification';
import { authenticate as verifyInboundJwt } from '@demo/utils-auth';

const creds: SessionCredentials = { principalId: 'acct_01', secret: 'redacted' };

export function bootstrapServices(): void {
  const users = new UserService();
  users.authenticate(creds);

  const orders = new OrderPipeline(users);
  orders.placeOrder({
    orderId: 'ord_1',
    creds,
    webhookPayload: '{}',
    webhookSig: 'a'.repeat(64),
  });

  const payments = new PaymentService(users);
  payments.capturePayment({
    paymentId: 'pay_1',
    creds,
    useMockIssuer: false,
  });

  const notifications = new NotificationService(users);
  notifications.dispatch({
    channelId: 'ch_1',
    creds,
    deviceToken: 'devtoken',
  });

  verifyInboundJwt('Bearer smoke');
}
