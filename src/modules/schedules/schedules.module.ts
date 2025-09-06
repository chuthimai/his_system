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

@Module({
  imports: [
    TypeOrmModule.forFeature([Location, Shift, WorkSchedule]),
    forwardRef(() => UsersModule),
    forwardRef(() => AppointmentsModule),
    forwardRef(() => BillingModule),
  ],
  controllers: [SchedulesController],
  providers: [SchedulesService],
  exports: [TypeOrmModule],
})
export class SchedulesModule {}
