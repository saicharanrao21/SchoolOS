import { Controller, Get, Post, Body, Param, Patch, UseGuards, Query } from '@nestjs/common';
import { SecurityService } from './security.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../../auth/decorators/user.decorator';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { Permissions } from '../../auth/decorators/permissions.decorator';

@Controller('security')
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
export class SecurityController {
  constructor(private readonly service: SecurityService) {}

  @Get('dashboard')
  @Permissions('security.read')
  async getDashboard(@User('org') organizationId: string, @Query('schoolId') schoolId: string) {
    return this.service.getDashboard(organizationId, schoolId);
  }

  // --- Visitors ---

  @Post('visitors/register')
  @Permissions('security.visitors.manage')
  async registerVisitor(@User('org') organizationId: string, @Body() data: any, @User('id') actorId: string) {
    return this.service.registerVisitor(organizationId, data, actorId);
  }

  @Post('visitors/:id/checkin')
  @Permissions('security.visitors.checkin')
  async checkIn(@Param('id') visitId: string, @Body('gateId') gateId: string, @User('id') actorId: string) {
    return this.service.checkInVisitor(visitId, gateId, actorId);
  }

  // --- Student Pickup ---

  @Post('pickups/request')
  @Permissions('pickup.request')
  async requestPickup(@User('org') organizationId: string, @Body() data: any, @User('id') actorId: string) {
    return this.service.requestPickup(organizationId, data, actorId);
  }

  @Post('pickups/:id/verify')
  @Permissions('pickup.verify')
  async verifyPickup(@Param('id') requestId: string, @Body('code') code: string) {
    return this.service.verifyPickup(requestId, code);
  }

  @Post('pickups/:id/release')
  @Permissions('pickup.release')
  async releaseStudent(@Param('id') requestId: string, @Body('gateId') gateId: string, @User('id') actorId: string) {
    return this.service.releaseStudent(requestId, gateId, actorId);
  }

  // --- Incidents ---

  @Post('incidents')
  @Permissions('incident.report')
  async reportIncident(@User('org') organizationId: string, @Body() data: any, @User('id') actorId: string) {
    return this.service.reportIncident(organizationId, data, actorId);
  }
}
