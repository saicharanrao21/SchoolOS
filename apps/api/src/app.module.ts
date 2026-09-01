import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { TenancyModule } from './tenancy/tenancy.module';
import { AuditModule } from './audit/audit.module';
import { IdentityModule } from './modules/identity/identity.module';
import { MasterDataModule } from './modules/master-data/master-data.module';
import { AcademicsModule } from './modules/academics/academics.module';
import { StudentsModule } from './modules/students/students.module';
import { GuardiansModule } from './modules/guardians/guardians.module';
import { AdmissionsModule } from './modules/admissions/admissions.module';
import { FinanceModule } from './modules/finance/finance.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    HealthModule,
    AuthModule,
    TenancyModule,
    AuditModule,
    IdentityModule,
    MasterDataModule,
    AcademicsModule,
    StudentsModule,
    GuardiansModule,
    AdmissionsModule,
    FinanceModule,
  ],
})
export class AppModule {}
