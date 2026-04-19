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
}
