import { Module } from '@nestjs/common';
import { PlatformTenantsService } from './tenants/tenants.service';
import { PlatformTenantsController } from './tenants/tenants.controller';
import { PlatformFeatureFlagsService } from './feature-flags/feature-flags.service';
import { PlatformFeatureFlagsController } from './feature-flags/feature-flags.controller';
import { BillingModule } from '../billing/billing.module';

@Module({
  imports: [BillingModule],
  controllers: [
    PlatformTenantsController,
    PlatformFeatureFlagsController,
  ],
  providers: [
    PlatformTenantsService,
    PlatformFeatureFlagsService,
  ],
  exports: [
    PlatformTenantsService,
    PlatformFeatureFlagsService,
  ],
})
export class PlatformModule {}
