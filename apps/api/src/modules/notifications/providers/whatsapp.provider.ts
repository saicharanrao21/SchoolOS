import { Injectable, Logger } from '@nestjs/common';
import { NotificationChannel } from '@prisma/client';
import { NotificationProvider, SendOptions, SendResult } from './notification-provider.interface';

@Injectable()
export class WhatsAppProvider implements NotificationProvider {
  private readonly logger = new Logger(WhatsAppProvider.name);
  channel = NotificationChannel.WHATSAPP;

  async send(options: SendOptions): Promise<SendResult> {
    this.logger.log(`Sending WhatsApp to ${options.recipient}: ${options.body}`);
    // Real implementation would use official Meta WhatsApp Business API
    return { success: true, providerMessageId: `mock-wa-${Date.now()}` };
  }
}
