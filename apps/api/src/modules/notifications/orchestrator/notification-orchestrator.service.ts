import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { DatabaseService } from '../../../database/database.service';
import {
  NotificationChannel,
  NotificationStatus,
  NotificationPriority,
  Prisma
} from '@prisma/client';
import { EmailProvider } from '../providers/email.provider';
import { SmsProvider } from '../providers/sms.provider';
import { WhatsAppProvider } from '../providers/whatsapp.provider';
import { PushProvider } from '../providers/push.provider';

@Injectable()
export class NotificationOrchestratorService {
  private readonly logger = new Logger(NotificationOrchestratorService.name);

  constructor(
    private readonly db: DatabaseService,
    private readonly emailProvider: EmailProvider,
    private readonly smsProvider: SmsProvider,
    private readonly whatsappProvider: WhatsAppProvider,
    private readonly pushProvider: PushProvider,
  ) {}

  @OnEvent('**')
  async onDomainEvent(data: any, event: string) {
    if (data && data.organizationId && data.schoolId) {
      await this.handleEvent(event, data, data.organizationId, data.schoolId);
    }
  }

  async handleEvent(event: string, data: any, organizationId: string, schoolId: string) {
    this.logger.log(`Processing event: ${event} for school ${schoolId}`);

    // 1. Resolve Recipients
    const recipients = await this.resolveRecipients(event, data, schoolId);

    for (const recipient of recipients) {
      // 2. Resolve Channels & Templates
      const channels = await this.resolveChannels(event, recipient.id, schoolId);

      for (const channel of channels) {
        // 3. Create Notification Record
        const template = await this.db.notificationTemplate.findFirst({
          where: { schoolId, event, channel, isActive: true },
          orderBy: { version: 'desc' },
        });

        if (!template && channel !== NotificationChannel.IN_APP) {
           this.logger.warn(`No template found for event ${event} on channel ${channel}`);
           continue;
        }

        const body = this.renderTemplate(template?.body || data.message || '', data);
        const subject = template?.subject ? this.renderTemplate(template.subject, data) : undefined;

        const notification = await this.db.notification.create({
          data: {
            organizationId,
            schoolId,
            event,
            recipientId: recipient.id,
            channel,
            templateId: template?.id,
            subject,
            body,
            status: NotificationStatus.QUEUED,
            priority: data.priority || NotificationPriority.NORMAL,
            metadata: data,
          },
        });

        // 4. Dispatch (For now, direct. Later, use BullMQ)
        await this.dispatch(notification.id);
      }
    }
  }

  private async resolveRecipients(event: string, data: any, schoolId: string): Promise<any[]> {
    // Logic to find users based on event data
    // e.g. student.absent -> find guardians of studentId
    if (data.userId) {
      const user = await this.db.user.findUnique({ where: { id: data.userId } });
      return user ? [user] : [];
    }

    if (data.studentId) {
       const student = await this.db.student.findUnique({
         where: { id: data.studentId },
         include: { guardians: { include: { guardian: { include: { user: true } } } } }
       });
       return student?.guardians
         .filter((g: any) => g.hasPortalAccess && g.guardian.user)
         .map((g: any) => g.guardian.user) || [];
    }

    return [];
  }

  private async resolveChannels(event: string, userId: string, schoolId: string): Promise<NotificationChannel[]> {
    // 1. Check User Preferences
    const prefs = await this.db.notificationPreference.findMany({
      where: { userId, event: { startsWith: event.split('.')[0] } }
    });

    // 2. Check School Policy (Mandatory channels)
    // Default to IN_APP and PUSH for now
    const channels = [NotificationChannel.IN_APP, NotificationChannel.PUSH];

    if (prefs.length > 0) {
       // Filter based on prefs
    }

    return channels;
  }

  private renderTemplate(content: string, variables: any): string {
    let rendered = content;
    // Simple regex replacement: {{variable.path}}
    const regex = /\{\{([\w.]+)\}\}/g;
    rendered = rendered.replace(regex, (match, path) => {
      const keys = path.split('.');
      let value = variables;
      for (const key of keys) {
        value = value?.[key];
        if (value === undefined) break;
      }
      return value !== undefined ? String(value) : match;
    });
    return rendered;
  }

  async dispatch(notificationId: string) {
    const notification = await this.db.notification.findUnique({
      where: { id: notificationId },
      include: { recipient: { include: { devices: true } } },
    });

    if (!notification || notification.status !== NotificationStatus.QUEUED) return;

    await this.db.notification.update({
      where: { id: notificationId },
      data: { status: NotificationStatus.PROCESSING },
    });

    try {
      let result;
      switch (notification.channel) {
        case NotificationChannel.EMAIL:
          result = await this.emailProvider.send({ recipient: notification.recipient.email, subject: notification.subject || undefined, body: notification.body });
          break;
        case NotificationChannel.SMS:
          result = await this.smsProvider.send({ recipient: notification.recipient.phone || '', body: notification.body });
          break;
        case NotificationChannel.WHATSAPP:
          result = await this.whatsappProvider.send({ recipient: notification.recipient.phone || '', body: notification.body });
          break;
        case NotificationChannel.PUSH:
          const token = notification.recipient.devices.find((d: any) => d.isActive)?.pushToken;
          if (token) {
            result = await this.pushProvider.send({ recipient: token, subject: notification.subject || undefined, body: notification.body });
          } else {
            result = { success: false, errorMessage: 'No active device token found' };
          }
          break;
        case NotificationChannel.IN_APP:
          // In-app is "delivered" as soon as it's created and status set to SENT
          result = { success: true };
          break;
      }

      if (result?.success) {
        await this.db.notification.update({
          where: { id: notificationId },
          data: {
            status: NotificationStatus.SENT,
            sentAt: new Date(),
            providerMessageId: result.providerMessageId
          },
        });
      } else {
        await this.db.notification.update({
          where: { id: notificationId },
          data: {
            status: NotificationStatus.FAILED,
            failedAt: new Date(),
            errorCode: result?.errorCode,
            errorMessage: result?.errorMessage
          },
        });
      }
    } catch (error) {
      this.logger.error(`Dispatch failed for notification ${notificationId}: ${error.message}`);
      await this.db.notification.update({
        where: { id: notificationId },
        data: { status: NotificationStatus.FAILED, errorMessage: error.message, failedAt: new Date() },
      });
    }
  }
}
