import { Controller, Get, Post, Body, Param, Patch, UseGuards, Query } from '@nestjs/common';
import { EventsService } from './events.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../../auth/decorators/user.decorator';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { Permissions } from '../../auth/decorators/permissions.decorator';

@Controller('events')
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
export class EventsController {
  constructor(private readonly service: EventsService) {}

  @Post()
  @Permissions('events.create')
  async create(@User('org') organizationId: string, @Body() data: any, @User('id') actorId: string) {
    return this.service.createEvent(organizationId, data, actorId);
  }

  @Post(':id/register')
  async register(@User('id') userId: string, @Param('id') eventId: string) {
    return this.service.register(userId, eventId);
  }

  @Get('dashboard')
  @Permissions('events.read')
  async getDashboard(@User('org') organizationId: string, @Query('schoolId') schoolId: string) {
    return this.service.getDashboard(organizationId, schoolId);
  }

  @Get()
  @Permissions('events.read')
  async findAll(@Query('schoolId') schoolId: string) {
    return this.service.findAllEvents(schoolId);
  }

  @Get('my')
  async getMyEvents(@User('id') userId: string) {
    return this.service.getMyEvents(userId);
  }
}
