import { forwardRef, Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { SchedulesModule } from 'src/schedules/schedules.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Appointment]),
    forwardRef(() => SchedulesModule),
    forwardRef(() => UsersModule),
  ],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
  exports: [TypeOrmModule],
})
export class AppointmentsModule {}
