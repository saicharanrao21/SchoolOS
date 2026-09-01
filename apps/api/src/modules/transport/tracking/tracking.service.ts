import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import { TripStatus } from '@prisma/client';

@Injectable()
export class TrackingService {
  private readonly logger = new Logger(TrackingService.name);

  constructor(private readonly db: DatabaseService) {}

  async updateLocation(tripId: string, data: any) {
    const trip = await this.db.transportTrip.findUnique({
      where: { id: tripId },
    });

    if (!trip || trip.status === TripStatus.COMPLETED) {
      return { success: false, message: 'Trip is not active' };
    }

    const location = await this.db.vehicleLocation.create({
      data: {
        tripId,
        latitude: data.latitude,
        longitude: data.longitude,
        speed: data.speed,
        heading: data.heading,
        timestamp: new Date(),
      },
    });

    // In a real implementation, we would broadcast this via WebSockets/Redis PubSub
    this.logger.log(`GPS Update for Trip ${tripId}: ${data.latitude}, ${data.longitude}`);

    return { success: true, location };
  }

  async getLatestLocation(tripId: string) {
    return this.db.vehicleLocation.findFirst({
      where: { tripId },
      orderBy: { timestamp: 'desc' },
    });
  }

  async getTripPath(tripId: string) {
    return this.db.vehicleLocation.findMany({
      where: { tripId },
      orderBy: { timestamp: 'asc' },
    });
  }
}
