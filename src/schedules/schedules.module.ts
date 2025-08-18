import { forwardRef, Module } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { SchedulesController } from './schedules.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shift } from './entities/shift.entity';
import { WorkSchedule } from './entities/work-schedule.entity';
import { LocationsModule } from 'src/locations/locations.module';
import { UsersModule } from 'src/users/users.module';
import { AppointmentsModule } from 'src/appointments/appointments.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Shift, WorkSchedule]),
    forwardRef(() => LocationsModule),
    forwardRef(() => UsersModule),
    forwardRef(() => AppointmentsModule),
  ],
  controllers: [SchedulesController],
  providers: [SchedulesService],
  exports: [TypeOrmModule],
})
export class SchedulesModule {}
