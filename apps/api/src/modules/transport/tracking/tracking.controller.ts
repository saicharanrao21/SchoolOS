import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { TrackingService } from './tracking.service';
import { AuthGuard } from '@nestjs/passport';
import { PermissionsGuard } from '../../../auth/guards/permissions.guard';
import { Permissions } from '../../../auth/decorators/permissions.decorator';

@Controller('transport/tracking')
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
export class TrackingController {
  constructor(private readonly service: TrackingService) {}

  @Post(':tripId/location')
  @Permissions('transport.gps.publish')
  updateLocation(@Param('tripId') tripId: string, @Body() data: any) {
    return this.service.updateLocation(tripId, data);
  }

  @Get(':tripId/latest')
  @Permissions('transport.gps.read')
  getLatest(@Param('tripId') tripId: string) {
    return this.service.getLatestLocation(tripId);
  }

  @Get(':tripId/path')
  @Permissions('transport.gps.read')
  getPath(@Param('tripId') tripId: string) {
    return this.service.getTripPath(tripId);
  }
}
