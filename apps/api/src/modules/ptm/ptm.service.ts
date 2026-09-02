import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { AuditService } from '../../audit/audit.service';
import { Prisma, PtmStatus } from '@prisma/client';

@Injectable()
export class PtmService {
  constructor(
    private readonly db: DatabaseService,
    private readonly audit: AuditService,
  ) {}

  async createPtmEvent(organizationId: string, data: any, actorId: string) {
    const event = await this.db.ptmEvent.create({
      data: {
        name: data.name,
        academicYearId: data.academicYearId,
        schoolId: data.schoolId,
        date: new Date(data.date),
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
        mode: data.mode,
      },
    });

    await this.audit.log({
      action: 'ptm.event.create',
      resource: 'PtmEvent',
      resourceId: event.id,
      actorId,
      organizationId,
    });

    return event;
  }

  async createSlots(organizationId: string, data: any, actorId: string) {
    const slots = data.slots.map((s: any) => ({
      ptmEventId: data.ptmEventId,
      teacherId: s.teacherId,
      startTime: new Date(s.startTime),
      endTime: new Date(s.endTime),
      room: s.room,
      status: PtmStatus.SCHEDULED,
    }));

    return this.db.ptmSlot.createMany({ data: slots });
  }

  async bookSlot(userId: string, slotId: string, data: any) {
    const guardian = await this.db.guardian.findUnique({ where: { userId } });
    if (!guardian) throw new NotFoundException('Guardian profile not found');

    const slot = await this.db.ptmSlot.findUnique({ where: { id: slotId } });
    if (!slot || slot.status !== PtmStatus.SCHEDULED) {
      throw new BadRequestException('Slot is not available');
    }

    return this.db.ptmSlot.update({
      where: { id: slotId },
      data: {
        studentId: data.studentId,
        guardianId: guardian.id,
        status: PtmStatus.CONFIRMED,
      },
    });
  }

  async getDashboard(organizationId: string, schoolId: string) {
    const [totalEvents, bookedSlots, totalSlots] = await Promise.all([
      this.db.ptmEvent.count({ where: { schoolId } }),
      this.db.ptmSlot.count({ where: { ptmEvent: { schoolId }, status: PtmStatus.CONFIRMED } }),
      this.db.ptmSlot.count({ where: { ptmEvent: { schoolId } } }),
    ]);

    return { totalEvents, bookedSlots, totalSlots };
  }

  async findAvailableSlots(eventId: string, teacherId?: string) {
    return this.db.ptmSlot.findMany({
      where: {
        ptmEventId: eventId,
        teacherId,
        status: PtmStatus.SCHEDULED
      },
      include: { teacher: { select: { firstName: true, lastName: true } } },
      orderBy: { startTime: 'asc' },
    });
  }

  async getTeacherMeetings(userId: string) {
    return this.db.ptmSlot.findMany({
      where: { teacher: { userId }, status: PtmStatus.CONFIRMED },
      include: {
        student: true,
        guardian: true,
        ptmEvent: true
      },
      orderBy: { startTime: 'asc' },
    });
  }

  async getGuardianMeetings(userId: string) {
    return this.db.ptmSlot.findMany({
      where: { guardian: { userId }, status: PtmStatus.CONFIRMED },
      include: {
        student: true,
        teacher: { select: { firstName: true, lastName: true } },
        ptmEvent: true
      },
      orderBy: { startTime: 'asc' },
    });
  }
}
