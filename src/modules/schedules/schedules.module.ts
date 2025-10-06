import { forwardRef, Module } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { SchedulesController } from './schedules.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shift } from './entities/shift.entity';
import { WorkSchedule } from './entities/work-schedule.entity';
import { UsersModule } from 'src/modules/users/users.module';
import { AppointmentsModule } from 'src/modules/appointments/appointments.module';
import { Location } from './entities/location.entity';
import { BillingModule } from 'src/modules/billing/billing.module';
import { AuthModule } from '@modules/auth/auth.module';
import { StaffWorkSchedule } from './entities/staff-work-schedule.entity';
import { SpecializationsModule } from '@modules/specializations/specializations.module';

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
