import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { JwtAuthGuard } from '@modules/auth/guards/jwt.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { ROLES } from 'src/constants/others';
import { WorkScheduleConditionDto } from './dto/work-schedules-by-condition.dto';
import { StaffWorkScheduleConditionDto } from './dto/staff-work-schedules-by-condition.dto';

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
