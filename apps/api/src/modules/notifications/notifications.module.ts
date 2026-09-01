import { Module, Global } from '@nestjs/common';
import { NotificationTemplatesService } from './templates/templates.service';
import { NotificationTemplatesController } from './templates/templates.controller';
import { NotificationLogsService } from './logs/logs.service';
import { NotificationLogsController } from './logs/logs.controller';
import { NotificationOrchestratorService } from './orchestrator/notification-orchestrator.service';
import { InAppNotificationsController } from './orchestrator/in-app.controller';
import { NotificationDevicesController } from './devices/devices.controller';
import { EmailProvider } from './providers/email.provider';
import { SmsProvider } from './providers/sms.provider';
import { WhatsAppProvider } from './providers/whatsapp.provider';
import { PushProvider } from './providers/push.provider';

@Global()
@Module({
  controllers: [
    NotificationTemplatesController,
    NotificationLogsController,
    InAppNotificationsController,
    NotificationDevicesController,
  ],
  providers: [
    NotificationTemplatesService,
    NotificationLogsService,
    NotificationOrchestratorService,
    EmailProvider,
    SmsProvider,
    WhatsAppProvider,
    PushProvider,
  ],
  exports: [
    NotificationTemplatesService,
    NotificationLogsService,
    NotificationOrchestratorService,
  ],
})
export class NotificationsModule {}
