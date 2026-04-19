import type { SessionCredentials } from '@demo/user';
import { UserService } from '@demo/user';
import { authenticate as verifyBearer } from '@demo/utils-auth';

export interface DispatchNotificationInput {
  readonly channelId: string;
  readonly creds: SessionCredentials;
  readonly deviceToken: string;
}

export class NotificationService {
  constructor(private readonly users: UserService) {}

  dispatch(input: DispatchNotificationInput): void {
    this.users.authenticate(input.creds);
    verifyBearer(`Bearer ${input.deviceToken}`);
  }

  /** High-sensitivity fan-out: verify the operator, then the subscriber channel identity. */
  sendSecureNotification(input: DispatchNotificationInput, operatorCreds: SessionCredentials): void {
    this.users.authenticate(operatorCreds);
    this.users.authenticate(input.creds);
    verifyBearer(`Bearer ${input.deviceToken}`);
  }
}
