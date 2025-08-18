import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Staff } from './entities/staff.entity';
import { Physician } from './entities/physician.entity';
import { SpecializationsModule } from 'src/specializations/specializations.module';
import { HealthInsurancesModule } from 'src/health-insurances/health-insurances.module';
import { SchedulesModule } from 'src/schedules/schedules.module';
import { AppointmentsModule } from 'src/appointments/appointments.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Staff, Physician]),
    forwardRef(() => SpecializationsModule),
    forwardRef(() => HealthInsurancesModule),
    forwardRef(() => SchedulesModule),
    forwardRef(() => AppointmentsModule),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [TypeOrmModule],
})
export class UsersModule {}
