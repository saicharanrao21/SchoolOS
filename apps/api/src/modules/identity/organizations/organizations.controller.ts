import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { Prisma } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../../auth/guards/roles.guard';
import { Roles } from '../../../auth/decorators/roles.decorator';
import { PermissionsGuard } from '../../../auth/guards/permissions.guard';
import { Permissions } from '../../../auth/decorators/permissions.decorator';

@Controller('organizations')
@UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Post()
  @Roles('SUPER_ADMIN')
  @Permissions('organization.create')
  create(@Body() createOrganizationDto: Prisma.OrganizationCreateInput) {
    return this.organizationsService.create(createOrganizationDto);
  }

  @Get()
  @Roles('SUPER_ADMIN')
  @Permissions('organization.read')
  findAll() {
    return this.organizationsService.findAll();
  }

  @Get(':id')
  @Permissions('organization.read')
  findOne(@Param('id') id: string) {
    return this.organizationsService.findOne(id);
  }

  @Patch(':id')
  @Permissions('organization.update')
  update(@Param('id') id: string, @Body() updateOrganizationDto: Prisma.OrganizationUpdateInput) {
    return this.organizationsService.update(id, updateOrganizationDto);
  }

  @Delete(':id')
  @Roles('SUPER_ADMIN')
  @Permissions('organization.archive')
  remove(@Param('id') id: string) {
    return this.organizationsService.remove(id);
  }
}
