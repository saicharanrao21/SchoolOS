import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { AuditService } from '../../audit/audit.service';
import { Prisma, BedStatus, OutpassStatus } from '@prisma/client';

@Injectable()
export class HostelService {
  constructor(
    private readonly db: DatabaseService,
    private readonly audit: AuditService,
  ) {}

  async createHostel(organizationId: string, data: any, actorId: string) {
    const hostel = await this.db.hostel.create({
      data: {
        name: data.name,
        type: data.type,
        schoolId: data.schoolId,
        campusId: data.campusId,
      },
    });

    await this.audit.log({
      action: 'hostel.create',
      resource: 'Hostel',
      resourceId: hostel.id,
      actorId,
      organizationId,
    });

    return hostel;
  }

  async allocateBed(organizationId: string, data: any, actorId: string) {
    return this.db.$transaction(async (tx) => {
      const bed = await tx.hostelBed.findUnique({
        where: { id: data.bedId },
      });

      if (!bed || bed.status !== BedStatus.AVAILABLE) {
        throw new BadRequestException('Bed is not available');
      }

      const allocation = await tx.hostelAllocation.create({
        data: {
          studentId: data.studentId,
          hostelId: data.hostelId,
          bedId: data.bedId,
          academicYearId: data.academicYearId,
          startDate: new Date(data.startDate),
          isActive: true,
        },
      });

      await tx.hostelBed.update({
        where: { id: data.bedId },
        data: { status: BedStatus.ALLOCATED },
      });

      return allocation;
    });
  }

  async requestOutpass(userId: string, data: any) {
    const allocation = await this.db.hostelAllocation.findFirst({
      where: { student: { userId }, isActive: true },
    });

    if (!allocation) throw new NotFoundException('Active hostel allocation not found');

    return this.db.hostelOutpass.create({
      data: {
        allocationId: allocation.id,
        reason: data.reason,
        departureDate: new Date(data.departureDate),
        expectedReturn: new Date(data.expectedReturn),
        status: OutpassStatus.PENDING,
      },
    });
  }

  async getDashboard(organizationId: string, schoolId: string) {
    const [residents, rooms, availableBeds] = await Promise.all([
      this.db.hostelAllocation.count({ where: { hostel: { schoolId }, isActive: true } }),
      this.db.hostelRoom.count({ where: { floor: { building: { hostel: { schoolId } } } } }),
      this.db.hostelBed.count({ where: { room: { floor: { building: { hostel: { schoolId } } } }, status: BedStatus.AVAILABLE } }),
    ]);

    return { totalResidents: residents, totalRooms: rooms, availableBeds };
  }

  async findAllHostels(schoolId: string) {
    return this.db.hostel.findMany({
      where: { schoolId },
      include: { buildings: { include: { floors: { include: { rooms: { include: { beds: true } } } } } } },
    });
  }

  async getStudentHostelInfo(userId: string) {
    return this.db.hostelAllocation.findFirst({
      where: { student: { userId }, isActive: true },
      include: {
        hostel: true,
        bed: { include: { room: { include: { floor: { include: { building: true } } } } } }
      },
    });
  }
}
