import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import { AuditService } from '../../../audit/audit.service';
import { Prisma, TimetableStatus } from '@prisma/client';

@Injectable()
export class TimetablesService {
  constructor(
    private readonly db: DatabaseService,
    private readonly audit: AuditService,
  ) {}

  async createPeriod(organizationId: string, data: any, actorId: string) {
    const period = await this.db.timetablePeriod.create({
      data: {
        schoolId: data.schoolId,
        campusId: data.campusId,
        dayOfWeek: data.dayOfWeek,
        periodNumber: data.periodNumber,
        startTime: data.startTime,
        endTime: data.endTime,
        isBreak: data.isBreak ?? false,
      },
    });

    await this.audit.log({
      action: 'academics.timetable_period.create',
      resource: 'TimetablePeriod',
      resourceId: period.id,
      actorId,
      organizationId,
      schoolId: data.schoolId,
    });

    return period;
  }

  async getPeriods(organizationId: string, schoolId: string, campusId?: string) {
    return this.db.timetablePeriod.findMany({
      where: { schoolId, campusId, status: 'ACTIVE' },
      orderBy: [{ dayOfWeek: 'asc' }, { periodNumber: 'asc' }],
    });
  }

  async createTimetable(organizationId: string, data: any, actorId: string) {
    return this.db.$transaction(async (tx) => {
      const timetable = await tx.timetable.create({
        data: {
          name: data.name,
          academicYearId: data.academicYearId,
          classId: data.classId,
          sectionId: data.sectionId,
          schoolId: data.schoolId,
          status: TimetableStatus.DRAFT,
        },
      });

      const version = await tx.timetableVersion.create({
        data: {
          timetableId: timetable.id,
          versionNumber: 1,
          status: 'DRAFT',
        },
      });

      await this.audit.log({
        action: 'academics.timetable.create',
        resource: 'Timetable',
        resourceId: timetable.id,
        actorId,
        organizationId,
        schoolId: data.schoolId,
      });

      return { timetable, version };
    });
  }

  async saveDraft(organizationId: string, versionId: string, entries: any[], actorId: string) {
    const version = await this.db.timetableVersion.findFirst({
      where: { id: versionId, timetable: { school: { organizationId } } },
    });
    if (!version) throw new NotFoundException('Timetable version not found');

    return this.db.$transaction(async (tx) => {
      // Clear existing entries for this version
      await tx.timetableEntry.deleteMany({ where: { timetableVersionId: versionId } });

      // Create new entries
      const createdEntries = await tx.timetableEntry.createMany({
        data: entries.map((e: any) => ({
          timetableVersionId: versionId,
          periodId: e.periodId,
          subjectId: e.subjectId,
          employeeId: e.employeeId,
          roomId: e.roomId,
        })),
      });

      return createdEntries;
    });
  }

  async validateTimetable(organizationId: string, versionId: string) {
    const version = await this.db.timetableVersion.findUnique({
      where: { id: versionId },
      include: {
        entries: {
          include: {
            period: true,
            employee: true,
            room: true,
            subject: true,
          },
        },
        timetable: true,
      },
    });

    if (!version) throw new NotFoundException('Version not found');

    const conflicts: string[] = [];

    // 1. Teacher Conflicts
    const teacherSlots = new Map<string, string>(); // "teacherId-day-period" -> "entry-info"
    for (const entry of version.entries) {
      const key = `${entry.employeeId}-${entry.period.dayOfWeek}-${entry.period.periodNumber}`;
      if (teacherSlots.has(key)) {
        conflicts.push(`Teacher ${entry.employee.firstName} has a conflict at ${entry.period.startTime} on day ${entry.period.dayOfWeek}`);
      }
      teacherSlots.set(key, entry.id);
    }

    // 2. Room Conflicts
    const roomSlots = new Map<string, string>(); // "roomId-day-period" -> "entry-info"
    for (const entry of version.entries) {
      if (entry.roomId) {
        const key = `${entry.roomId}-${entry.period.dayOfWeek}-${entry.period.periodNumber}`;
        if (roomSlots.has(key)) {
          conflicts.push(`Room ${entry.room?.name} has a conflict at ${entry.period.startTime} on day ${entry.period.dayOfWeek}`);
        }
        roomSlots.set(key, entry.id);
      }
    }

    return {
      isValid: conflicts.length === 0,
      conflicts,
    };
  }

  async publish(organizationId: string, versionId: string, actorId: string) {
    const validation = await this.validateTimetable(organizationId, versionId);
    if (!validation.isValid) {
      throw new BadRequestException('Cannot publish timetable with conflicts: ' + validation.conflicts.join(', '));
    }

    return this.db.$transaction(async (tx) => {
      const version = await tx.timetableVersion.findUnique({
        where: { id: versionId },
        include: { timetable: true },
      });

      // Archive previous published versions of this timetable
      await tx.timetableVersion.updateMany({
        where: { timetableId: version!.timetableId, status: 'PUBLISHED' },
        data: { status: 'ARCHIVED' },
      });

      const updatedVersion = await tx.timetableVersion.update({
        where: { id: versionId },
        data: {
          status: 'PUBLISHED',
          publishedAt: new Date(),
          publishedById: actorId,
        },
      });

      await tx.timetable.update({
        where: { id: version!.timetableId },
        data: { status: TimetableStatus.PUBLISHED, currentVersion: version!.versionNumber },
      });

      await this.audit.log({
        action: 'academics.timetable.publish',
        resource: 'TimetableVersion',
        resourceId: versionId,
        actorId,
        organizationId,
        schoolId: version!.timetable.schoolId,
      });

      return updatedVersion;
    });
  }

  async getPublishedTimetable(classId: string, sectionId: string) {
    const timetable = await this.db.timetable.findFirst({
      where: { classId, sectionId, status: TimetableStatus.PUBLISHED },
      include: {
        versions: {
          where: { status: 'PUBLISHED' },
          include: {
            entries: {
              include: {
                period: true,
                subject: true,
                employee: true,
                room: true,
              },
            },
          },
        },
      },
    });

    return timetable?.versions[0] || null;
  }
}
