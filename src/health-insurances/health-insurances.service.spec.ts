import { Test, TestingModule } from '@nestjs/testing';
import { HealthInsurancesService } from './health-insurances.service';

describe('HealthInsurancesService', () => {
  let service: HealthInsurancesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HealthInsurancesService],
    }).compile();

    service = module.get<HealthInsurancesService>(HealthInsurancesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
