import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import { AuditService } from '../../../audit/audit.service';
import { Prisma, AdmissionStatus, LeadSource } from '@prisma/client';

@Injectable()
export class EnquiriesService {
  constructor(
    private readonly db: DatabaseService,
    private readonly audit: AuditService,
  ) {}

  async create(organizationId: string, data: any, actorId?: string) {
    const school = await this.db.school.findFirst({
      where: { id: data.schoolId, organizationId },
    });
    if (!school) throw new NotFoundException('School not found');

    const enquiryNumber = await this.generateEnquiryNumber(school.id, school.code || 'SCH');

    const enquiry = await this.db.admissionEnquiry.create({
      data: {
        enquiryNumber,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
        gender: data.gender,
        interestedClassId: data.interestedClassId,
        academicYearId: data.academicYearId,
        campusId: data.campusId,
        source: data.source || LeadSource.OTHER,
        notes: data.notes,
        assignedToId: data.assignedToId,
        schoolId: school.id,
      },
    });

    await this.audit.log({
      action: 'admission.enquiry.create',
      resource: 'AdmissionEnquiry',
      resourceId: enquiry.id,
      actorId,
      organizationId,
      schoolId: school.id,
      metadata: { enquiryNumber },
    });

    return enquiry;
  }

  private async generateEnquiryNumber(schoolId: string, schoolCode: string): Promise<string> {
    const year = new Date().getFullYear().toString().slice(-2);
    const count = await this.db.admissionEnquiry.count({ where: { schoolId } });
    return `ENQ-${schoolCode}${year}${(count + 1).toString().padStart(4, '0')}`;
  }

  async findAll(organizationId: string, filters: any) {
    const { page = 1, limit = 10, search, status, schoolId } = filters;
    const skip = (parseInt(page.toString()) - 1) * parseInt(limit.toString());

    const where: Prisma.AdmissionEnquiryWhereInput = {
      school: { organizationId },
    };

    if (schoolId) where.schoolId = schoolId;
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
        { enquiryNumber: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.db.admissionEnquiry.findMany({
        where,
        skip,
        take: parseInt(limit.toString()),
        orderBy: { createdAt: 'desc' },
        include: { assignedTo: { select: { id: true, firstName: true, lastName: true } } },
      }),
      this.db.admissionEnquiry.count({ where }),
    ]);

    return {
      items,
      meta: {
        total,
        page: parseInt(page.toString()),
        limit: parseInt(limit.toString()),
        totalPages: Math.ceil(total / parseInt(limit.toString())),
      }
    };
  }

  async findOne(organizationId: string, id: string) {
    const enquiry = await this.db.admissionEnquiry.findFirst({
      where: { id, school: { organizationId } },
      include: {
        followUps: { include: { staff: { select: { firstName: true, lastName: true } } } },
        applications: true,
        assignedTo: true
      },
    });
    if (!enquiry) throw new NotFoundException('Enquiry not found');
    return enquiry;
  }

  async addFollowUp(organizationId: string, enquiryId: string, data: any, actorId: string) {
    const enquiry = await this.findOne(organizationId, enquiryId);

    return this.db.admissionFollowUp.create({
      data: {
        enquiryId: enquiry.id,
        scheduledDate: new Date(data.scheduledDate),
        method: data.method,
        purpose: data.purpose,
        notes: data.notes,
        staffId: actorId,
      },
    });
  }
}
