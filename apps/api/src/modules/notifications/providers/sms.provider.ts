import { Injectable, Logger } from '@nestjs/common';
import { NotificationChannel } from '@prisma/client';
import { NotificationProvider, SendOptions, SendResult } from './notification-provider.interface';

@Injectable()
export class SmsProvider implements NotificationProvider {
  private readonly logger = new Logger(SmsProvider.name);
  channel = NotificationChannel.SMS;

  async send(options: SendOptions): Promise<SendResult> {
    this.logger.log(`Sending SMS to ${options.recipient}: ${options.body}`);
    // Real implementation would use Twilio, MessageBird, etc.
    return { success: true, providerMessageId: `mock-sms-${Date.now()}` };
  }
}
