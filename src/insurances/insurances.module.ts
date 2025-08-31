import { Module } from '@nestjs/common';
import { InsurancesService } from './insurances.service';
import { InsurancesController } from './insurances.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthInsurance } from './entities/health-insurance.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HealthInsurance])],
  controllers: [InsurancesController],
  providers: [InsurancesService],
  exports: [TypeOrmModule],
})
export class InsurancesModule {}
