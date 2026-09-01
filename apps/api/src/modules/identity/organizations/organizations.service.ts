import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class OrganizationsService {
  constructor(private readonly db: DatabaseService) {}

  async create(data: Prisma.OrganizationCreateInput) {
    return this.db.organization.create({ data });
  }

  async findAll() {
    return this.db.organization.findMany({
      where: { isActive: true },
    });
  }

  async findOne(id: string) {
    const org = await this.db.organization.findUnique({
      where: { id },
    });
    if (!org) throw new NotFoundException('Organization not found');
    return org;
  }

  async update(id: string, data: Prisma.OrganizationUpdateInput) {
    return this.db.organization.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.db.organization.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
