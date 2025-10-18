import { JwtAuthGuard } from '@modules/auth/guards/jwt.guard';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ROLES } from 'src/constants/others';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';

import { StaffWorkScheduleConditionDto } from './dto/staff-work-schedules-by-condition.dto';
import { WorkScheduleConditionDto } from './dto/work-schedules-by-condition.dto';
import { SchedulesService } from './schedules.service';

@Controller('schedules')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.PATIENT)
  @Post('/work-schedules-by-condition')
  getAllWorkSchedulesByCondition(
    @Body() workScheduleConditionDto: WorkScheduleConditionDto,
  ) {
    return this.schedulesService.findAllWorkSchedulesByCondition(
      workScheduleConditionDto,
    );
  }

  // Api for get information to show on physician's profile and specify specialty examination
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.PHYSICIAN)
  @Post('/staff-work-schedules-by-condition')
  getAllStaffWorkSchedulesByCondition(
    @Body() staffWorkScheduleConditionDto: StaffWorkScheduleConditionDto,
  ) {
    return this.schedulesService.findAllStaffWorkSchedulesByCondition(
      staffWorkScheduleConditionDto,
    );
  }
}
