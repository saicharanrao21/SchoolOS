import { Module } from '@nestjs/common';
import { ExamsConfigService } from './config/exams-config.service';
import { ExaminationsService } from './examinations.service';
import { ExamSchedulesService } from './schedules/exam-schedules.service';
import { MarksEntryService } from './marks/marks-entry.service';
import { ResultsService } from './results/results.service';
import { ExaminationsController } from './examinations.controller';
import { ExamsConfigController } from './config/exams-config.controller';
import { ExamSchedulesController } from './schedules/exam-schedules.controller';
import { MarksEntryController } from './marks/marks-entry.controller';
import { ResultsController } from './results/results.controller';

@Module({
  controllers: [
    ExaminationsController,
    ExamsConfigController,
    ExamSchedulesController,
    MarksEntryController,
    ResultsController,
  ],
  providers: [
    ExamsConfigService,
    ExaminationsService,
    ExamSchedulesService,
    MarksEntryService,
    ResultsService,
  ],
  exports: [
    ExamsConfigService,
    ExaminationsService,
    ExamSchedulesService,
    MarksEntryService,
    ResultsService,
  ],
})
export class ExamsModule {}
