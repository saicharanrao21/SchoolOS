import { Module } from '@nestjs/common';
import { HrEmployeesService } from './employees/hr-employees.service';
import { HrEmployeesController } from './employees/hr-employees.controller';
import { HrDesignationsService } from './designations/hr-designations.service';
import { HrDesignationsController } from './designations/hr-designations.controller';
import { HrSelfServiceService } from './self-service/hr-self-service.service';
import { HrSelfServiceController } from './self-service/hr-self-service.controller';

@Module({
  controllers: [HrEmployeesController, HrDesignationsController, HrSelfServiceController],
  providers: [HrEmployeesService, HrDesignationsService, HrSelfServiceService],
  exports: [HrEmployeesService, HrDesignationsService, HrSelfServiceService],
})
export class HrModule {}
