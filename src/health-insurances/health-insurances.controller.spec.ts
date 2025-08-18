import { Test, TestingModule } from '@nestjs/testing';
import { HealthInsurancesController } from './health-insurances.controller';
import { HealthInsurancesService } from './health-insurances.service';

describe('HealthInsurancesController', () => {
  let controller: HealthInsurancesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthInsurancesController],
      providers: [HealthInsurancesService],
    }).compile();

    controller = module.get<HealthInsurancesController>(HealthInsurancesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
