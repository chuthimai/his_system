import { AuthModule } from '@modules/auth/auth.module';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SchedulesModule } from 'src/modules/schedules/schedules.module';
import { UsersModule } from 'src/modules/users/users.module';

import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { Appointment } from './entities/appointment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Appointment]),
    forwardRef(() => SchedulesModule),
    forwardRef(() => UsersModule),
    forwardRef(() => AuthModule),
  ],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
  exports: [TypeOrmModule],
})
export class AppointmentsModule {}
