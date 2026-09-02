import { Controller, Get, Post, Body, Param, UseGuards, Query } from '@nestjs/common';
import { DataExchangeService } from './data-exchange.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../../auth/decorators/user.decorator';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { Permissions } from '../../auth/decorators/permissions.decorator';

@Controller('exchange')
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
export class DataExchangeController {
  constructor(private readonly service: DataExchangeService) {}

  @Post('import')
  @Permissions('imports.create')
  async createImport(@User('org') organizationId: string, @Body() data: any, @User('id') actorId: string) {
    return this.service.createImportJob(organizationId, data, actorId);
  }

  @Post('export')
  @Permissions('exports.create')
  async createExport(@User('org') organizationId: string, @Body() data: any, @User('id') actorId: string) {
    return this.service.createExportJob(organizationId, data, actorId);
  }

  @Get('jobs')
  @Permissions('imports.read', 'exports.read')
  async listJobs(@User('org') organizationId: string, @Query('schoolId') schoolId: string) {
    return this.service.listJobs(organizationId, schoolId);
  }

  @Get('import/:id')
  async getImportStatus(@Param('id') id: string) {
    return this.service.getImportStatus(id);
  }

  @Get('export/:id')
  async getExportStatus(@Param('id') id: string) {
    return this.service.getExportStatus(id);
  }
}
