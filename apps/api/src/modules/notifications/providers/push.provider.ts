import { Injectable, Logger } from '@nestjs/common';
import { NotificationChannel } from '@prisma/client';
import { NotificationProvider, SendOptions, SendResult } from './notification-provider.interface';

@Injectable()
export class PushProvider implements NotificationProvider {
  private readonly logger = new Logger(PushProvider.name);
  channel = NotificationChannel.PUSH;

  async send(options: SendOptions): Promise<SendResult> {
    this.logger.log(`Sending Push Notification to ${options.recipient}: ${options.body}`);
    // Real implementation would use FCM (Firebase Cloud Messaging)
    return { success: true, providerMessageId: `mock-push-${Date.now()}` };
  }
}
