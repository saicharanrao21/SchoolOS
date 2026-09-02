import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { AuditService } from '../../audit/audit.service';
import { ImportStatus, ExportStatus } from '@prisma/client';

@Injectable()
export class DataExchangeService {
  constructor(
    private readonly db: DatabaseService,
    private readonly audit: AuditService,
  ) {}

  async createImportJob(organizationId: string, data: any, actorId: string) {
    const job = await this.db.importJob.create({
      data: {
        template: data.template,
        filePath: data.filePath,
        organizationId,
        schoolId: data.schoolId,
        createdById: actorId,
        status: ImportStatus.UPLOADED,
      },
    });

    await this.audit.log({
      action: 'import.job.create',
      resource: 'ImportJob',
      resourceId: job.id,
      actorId,
      organizationId,
    });

    return job;
  }

  async createExportJob(organizationId: string, data: any, actorId: string) {
    const job = await this.db.exportJob.create({
      data: {
        entity: data.entity,
        format: data.format,
        filters: data.filters,
        organizationId,
        schoolId: data.schoolId,
        createdById: actorId,
        status: ExportStatus.QUEUED,
      },
    });

    await this.audit.log({
      action: 'export.job.create',
      resource: 'ExportJob',
      resourceId: job.id,
      actorId,
      organizationId,
    });

    return job;
  }

  async getImportStatus(id: string) {
    return this.db.importJob.findUnique({
      where: { id },
    });
  }

  async getExportStatus(id: string) {
    return this.db.exportJob.findUnique({
      where: { id },
    });
  }

  async listJobs(organizationId: string, schoolId: string) {
    const imports = await this.db.importJob.findMany({
      where: { organizationId, schoolId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    const exports = await this.db.exportJob.findMany({
      where: { organizationId, schoolId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    return { imports, exports };
  }
}
