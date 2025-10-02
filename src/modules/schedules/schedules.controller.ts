import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { ShiftConditionDto } from './dto/get-shifts-by-condition.dto';
import { JwtAuthGuard } from '@modules/auth/guards/jwt.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { ROLES } from 'src/constants/others';
import { WorkScheduleConditionDto } from './dto/get-work-schedules-by-condition.dto';
import { StaffWorkScheduleConditionDto } from './dto/get-staff-work-schedules-by-condition.dto';

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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.PATIENT)
  @Post('/shifts-by-condition')
  getAllShiftsByCondition(@Body() shiftConditionDto: ShiftConditionDto) {
    return this.schedulesService.findAllShiftsByCondition(shiftConditionDto);
  }
}
