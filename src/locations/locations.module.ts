import { forwardRef, Module } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { LocationsController } from './locations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Location } from './entities/location.entity';
import { SchedulesModule } from 'src/schedules/schedules.module';
// import { WorkSchedule } from 'src/schedules/entities/work-schedule.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Location]),
    forwardRef(() => SchedulesModule),
  ],
  controllers: [LocationsController],
  providers: [LocationsService],
  exports: [TypeOrmModule],
})
export class LocationsModule {}
