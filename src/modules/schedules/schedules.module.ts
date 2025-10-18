import { AuthModule } from '@modules/auth/auth.module';
import { SpecializationsModule } from '@modules/specializations/specializations.module';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentsModule } from 'src/modules/appointments/appointments.module';
import { BillingModule } from 'src/modules/billing/billing.module';
import { UsersModule } from 'src/modules/users/users.module';

import { Location } from './entities/location.entity';
import { Shift } from './entities/shift.entity';
import { StaffWorkSchedule } from './entities/staff-work-schedule.entity';
import { WorkSchedule } from './entities/work-schedule.entity';
import { SchedulesController } from './schedules.controller';
import { SchedulesService } from './schedules.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Location,
      Shift,
      WorkSchedule,
      StaffWorkSchedule,
    ]),
    forwardRef(() => UsersModule),
    forwardRef(() => AppointmentsModule),
    forwardRef(() => BillingModule),
    forwardRef(() => AuthModule),
    forwardRef(() => AppointmentsModule),
    forwardRef(() => SpecializationsModule),
  ],
  controllers: [SchedulesController],
  providers: [SchedulesService],
  exports: [TypeOrmModule, SchedulesService],
})
export class SchedulesModule {}
