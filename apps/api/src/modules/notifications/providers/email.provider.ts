import { Injectable, Logger } from '@nestjs/common';
import { NotificationChannel } from '@prisma/client';
import { NotificationProvider, SendOptions, SendResult } from './notification-provider.interface';

@Injectable()
export class EmailProvider implements NotificationProvider {
  private readonly logger = new Logger(EmailProvider.name);
  channel = NotificationChannel.EMAIL;

  async send(options: SendOptions): Promise<SendResult> {
    this.logger.log(`Sending Email to ${options.recipient}: ${options.subject}`);
    // Real implementation would use Nodemailer, SendGrid, etc.
    return { success: true, providerMessageId: `mock-email-${Date.now()}` };
  }
}
