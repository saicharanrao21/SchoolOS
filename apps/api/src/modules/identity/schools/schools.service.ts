import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class SchoolsService {
  constructor(private readonly db: DatabaseService) {}

  async create(organizationId: string, data: Omit<Prisma.SchoolCreateInput, 'organization'>) {
    return this.db.school.create({
      data: {
        ...data,
        organization: { connect: { id: organizationId } },
      },
    });
  }

  async findAll(organizationId: string) {
    return this.db.school.findMany({
      where: { organizationId, isActive: true },
    });
  }

  async findOne(organizationId: string, id: string) {
    const school = await this.db.school.findFirst({
      where: { id, organizationId },
    });
    if (!school) throw new NotFoundException('School not found in this organization');
    return school;
  }

  async update(organizationId: string, id: string, data: Prisma.SchoolUpdateInput) {
    // Ensure ownership before update
    await this.findOne(organizationId, id);
    return this.db.school.update({
      where: { id },
      data,
    });
  }

  async remove(organizationId: string, id: string) {
    await this.findOne(organizationId, id);
    return this.db.school.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
