import { Module } from '@nestjs/common';
import { FeeCategoriesModule } from './fee-categories/fee-categories.module';
import { FeeStructuresModule } from './fee-structures/fee-structures.module';
import { FeeAssignmentsModule } from './fee-assignments/fee-assignments.module';
import { PaymentsModule } from './payments/payments.module';
import { InvoicesModule } from './invoices/invoices.module';
import { LedgersModule } from './ledgers/ledgers.module';
import { StudentAccountModule } from './ledgers/student-account.module';
import { AccountingModule } from '../accounting/accounting.module';

@Module({
  imports: [
    FeeCategoriesModule,
    FeeStructuresModule,
    FeeAssignmentsModule,
    PaymentsModule,
    InvoicesModule,
    LedgersModule,
    StudentAccountModule,
    AccountingModule,
  ],
})
export class FinanceModule {}
