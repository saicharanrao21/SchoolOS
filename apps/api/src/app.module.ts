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
import { AccountingModule } from './modules/accounting/accounting.module';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { LeaveModule } from './modules/leave/leave.module';

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
    AccountingModule,
    AttendanceModule,
    LeaveModule,
  ],
})
export class AppModule {}
