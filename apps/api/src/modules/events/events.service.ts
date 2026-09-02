import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { AuditService } from '../../audit/audit.service';
import { Prisma, EventStatus, RegistrationStatus } from '@prisma/client';

@Injectable()
export class EventsService {
  constructor(
    private readonly db: DatabaseService,
    private readonly audit: AuditService,
  ) {}

  async createEvent(organizationId: string, data: any, actorId: string) {
    const event = await this.db.schoolEvent.create({
      data: {
        title: data.title,
        description: data.description,
        category: data.category,
        schoolId: data.schoolId,
        campusId: data.campusId,
        venueId: data.venueId,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        registrationStart: data.registrationStart ? new Date(data.registrationStart) : null,
        registrationEnd: data.registrationEnd ? new Date(data.registrationEnd) : null,
        capacity: data.capacity,
        status: EventStatus.DRAFT,
        visibility: data.visibility || 'PUBLIC',
      },
    });

    await this.audit.log({
      action: 'event.create',
      resource: 'SchoolEvent',
      resourceId: event.id,
      actorId,
      organizationId,
    });

    return event;
  }

  async register(userId: string, eventId: string) {
    return this.db.$transaction(async (tx) => {
      const event = await tx.schoolEvent.findUnique({
        where: { id: eventId },
        include: { _count: { select: { participants: true } } },
      });

      if (!event || event.status !== EventStatus.PUBLISHED) {
        throw new BadRequestException('Event is not open for registration');
      }

      if (event.capacity && event._count.participants >= event.capacity) {
        throw new BadRequestException('Event reached maximum capacity');
      }

      return tx.eventParticipant.create({
        data: {
          eventId,
          userId,
          status: RegistrationStatus.CONFIRMED,
        },
      });
    });
  }

  async getDashboard(organizationId: string, schoolId: string) {
    const today = new Date();
    const [upcoming, totalParticipants] = await Promise.all([
      this.db.schoolEvent.count({ where: { schoolId, startDate: { gte: today } } }),
      this.db.eventParticipant.count({ where: { event: { schoolId } } }),
    ]);

    return { upcomingEvents: upcoming, totalParticipants };
  }

  async findAllEvents(schoolId: string) {
    return this.db.schoolEvent.findMany({
      where: { schoolId },
      include: { venue: true, _count: { select: { participants: true } } },
      orderBy: { startDate: 'asc' },
    });
  }

  async getMyEvents(userId: string) {
    return this.db.eventParticipant.findMany({
      where: { userId },
      include: { event: { include: { venue: true } } },
    });
  }
}
