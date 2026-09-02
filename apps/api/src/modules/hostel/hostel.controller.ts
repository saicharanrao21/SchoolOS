import { Controller, Get, Post, Body, Param, Patch, UseGuards, Query } from '@nestjs/common';
import { HostelService } from './hostel.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../../auth/decorators/user.decorator';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { Permissions } from '../../auth/decorators/permissions.decorator';

@Controller('hostel')
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
export class HostelController {
  constructor(private readonly service: HostelService) {}

  @Post()
  @Permissions('hostel.manage')
  async createHostel(@User('org') organizationId: string, @Body() data: any, @User('id') actorId: string) {
    return this.service.createHostel(organizationId, data, actorId);
  }

  @Post('allocate')
  @Permissions('hostel.allocate')
  async allocateBed(@User('org') organizationId: string, @Body() data: any, @User('id') actorId: string) {
    return this.service.allocateBed(organizationId, data, actorId);
  }

  @Post('outpass')
  async requestOutpass(@User('id') userId: string, @Body() data: any) {
    return this.service.requestOutpass(userId, data);
  }

  @Get('dashboard')
  @Permissions('hostel.read')
  async getDashboard(@User('org') organizationId: string, @Query('schoolId') schoolId: string) {
    return this.service.getDashboard(organizationId, schoolId);
  }

  @Get('hostels')
  @Permissions('hostel.read')
  async findAll(@Query('schoolId') schoolId: string) {
    return this.service.findAllHostels(schoolId);
  }

  @Get('my-hostel')
  async getMyHostel(@User('id') userId: string) {
    return this.service.getStudentHostelInfo(userId);
  }
}
