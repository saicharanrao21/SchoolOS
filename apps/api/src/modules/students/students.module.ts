import { Module } from '@nestjs/common';
import { StudentsController } from './students.controller';
import { StudentEnrollmentsController } from './enrollments.controller';
import { StudentHistoryController } from './student-history.controller';
import { StudentDocumentsController } from './student-documents.controller';
import { StudentLifecycleController } from './student-lifecycle.controller';
import { StudentsService } from './students.service';
import { EnrollmentsService } from './enrollments.service';
import { StudentHistoryService } from './student-history.service';
import { StudentDocumentsService } from './student-documents.service';
import { StudentLifecycleService } from './student-lifecycle.service';

@Module({
  controllers: [
    StudentsController,
    StudentEnrollmentsController,
    StudentHistoryController,
    StudentDocumentsController,
    StudentLifecycleController,
  ],
  providers: [
    StudentsService,
    EnrollmentsService,
    StudentHistoryService,
    StudentDocumentsService,
    StudentLifecycleService,
  ],
  exports: [
    StudentsService,
    EnrollmentsService,
    StudentHistoryService,
    StudentDocumentsService,
    StudentLifecycleService,
  ],
})
export class StudentsModule {}
