import { Controller, Get, Post, Body, Param, UseGuards, Query } from '@nestjs/common';
import { ProcurementService } from './procurement.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../../auth/decorators/user.decorator';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { Permissions } from '../../auth/decorators/permissions.decorator';

@Controller('procurement')
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
export class ProcurementController {
  constructor(private readonly service: ProcurementService) {}

  @Post('po')
  @Permissions('procurement.po.create')
  async createPO(@User('org') organizationId: string, @Body() data: any, @User('id') actorId: string) {
    return this.service.createPO(organizationId, data, actorId);
  }

  @Post('receipts')
  @Permissions('procurement.receive')
  async recordReceipt(@User('org') organizationId: string, @Body() data: any, @User('id') actorId: string) {
    return this.service.recordReceipt(organizationId, data, actorId);
  }

  @Get('dashboard')
  @Permissions('procurement.read')
  async getDashboard(@User('org') organizationId: string, @Query('schoolId') schoolId: string) {
    return this.service.getDashboard(organizationId, schoolId);
  }
}
