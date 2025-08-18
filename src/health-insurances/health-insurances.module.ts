import { forwardRef, Module } from '@nestjs/common';
import { HealthInsurancesService } from './health-insurances.service';
import { HealthInsurancesController } from './health-insurances.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthInsurance } from './entities/health-insurance.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([HealthInsurance]),
    forwardRef(() => UsersModule),
  ],
  controllers: [HealthInsurancesController],
  providers: [HealthInsurancesService],
  exports: [TypeOrmModule],
})
export class HealthInsurancesModule {}
