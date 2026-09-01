import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CampusesService {
  constructor(private readonly db: DatabaseService) {}

  async create(organizationId: string, data: any) {
    // Verify school belongs to organization
    const school = await this.db.school.findFirst({
      where: { id: data.schoolId, organizationId },
    });
    if (!school) throw new NotFoundException('School not found');

    return this.db.campus.create({
      data: {
        name: data.name,
        code: data.code,
        address: data.address,
        school: { connect: { id: data.schoolId } },
      },
    });
  }

  async findAll(organizationId: string) {
    return this.db.campus.findMany({
      where: {
        school: { organizationId },
        isActive: true,
      },
      include: { school: true },
    });
  }

  async findOne(organizationId: string, id: string) {
    const campus = await this.db.campus.findFirst({
      where: { id, school: { organizationId } },
      include: { school: true },
    });
    if (!campus) throw new NotFoundException('Campus not found');
    return campus;
  }

  async update(organizationId: string, id: string, data: Prisma.CampusUpdateInput) {
    await this.findOne(organizationId, id);
    return this.db.campus.update({
      where: { id },
      data,
    });
  }

  async remove(organizationId: string, id: string) {
    await this.findOne(organizationId, id);
    return this.db.campus.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
