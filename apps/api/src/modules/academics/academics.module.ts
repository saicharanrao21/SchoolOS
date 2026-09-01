import { Module } from '@nestjs/common';
import { AcademicYearsModule } from './academic-years/academic-years.module';
import { TermsModule } from './terms/terms.module';
import { ClassesModule } from './classes/classes.module';
import { SectionsModule } from './sections/sections.module';
import { SubjectsModule } from './subjects/subjects.module';

@Module({
  imports: [
    AcademicYearsModule,
    TermsModule,
    ClassesModule,
    SectionsModule,
    SubjectsModule,
  ],
})
export class AcademicsModule {}
