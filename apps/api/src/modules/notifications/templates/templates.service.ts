import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import { AuditService } from '../../../audit/audit.service';
import { NotificationChannel } from '@prisma/client';

@Injectable()
export class NotificationTemplatesService {
  constructor(
    private readonly db: DatabaseService,
    private readonly audit: AuditService,
  ) {}

  async create(organizationId: string, data: any, actorId: string) {
    const template = await this.db.notificationTemplate.create({
      data: {
        name: data.name,
        event: data.event,
        channel: data.channel,
        subject: data.subject,
        body: data.body,
        language: data.language || 'en',
        variables: data.variables,
        schoolId: data.schoolId,
      },
    });

    await this.audit.log({
      action: 'notifications.template.create',
      resource: 'NotificationTemplate',
      resourceId: template.id,
      actorId,
      organizationId,
      schoolId: data.schoolId,
    });

    return template;
  }

  async findAll(organizationId: string, schoolId: string) {
    return this.db.notificationTemplate.findMany({
      where: { schoolId, school: { organizationId } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(organizationId: string, id: string, data: any, actorId: string) {
    const existing = await this.db.notificationTemplate.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Template not found');

    const updated = await this.db.notificationTemplate.update({
      where: { id },
      data: {
        subject: data.subject,
        body: data.body,
        isActive: data.isActive,
      },
    });

    await this.audit.log({
      action: 'notifications.template.update',
      resource: 'NotificationTemplate',
      resourceId: id,
      actorId,
      organizationId,
    });

    return updated;
  }
}
