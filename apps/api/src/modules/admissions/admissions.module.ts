import { Module } from '@nestjs/common';
import { EnquiriesModule } from './enquiries/enquiries.module';
import { ApplicationsModule } from './applications/applications.module';

@Module({
  imports: [EnquiriesModule, ApplicationsModule],
  exports: [EnquiriesModule, ApplicationsModule],
})
export class AdmissionsModule {}
