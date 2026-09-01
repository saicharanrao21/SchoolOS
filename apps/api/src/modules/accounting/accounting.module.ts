import { Module } from '@nestjs/common';
import { FiscalYearsModule } from './fiscal-years/fiscal-years.module';
import { AccountsModule } from './accounts/accounts.module';
import { JournalEntriesModule } from './journal-entries/journal-entries.module';
import { AccountingReportsModule } from './reports/reports.module';
import { AccountingIntegrationService } from './accounting-integration.service';

@Module({
  imports: [
    FiscalYearsModule,
    AccountsModule,
    JournalEntriesModule,
    AccountingReportsModule,
  ],
  providers: [AccountingIntegrationService],
  exports: [
    FiscalYearsModule,
    AccountsModule,
    JournalEntriesModule,
    AccountingReportsModule,
    AccountingIntegrationService,
  ],
})
export class AccountingModule {}
