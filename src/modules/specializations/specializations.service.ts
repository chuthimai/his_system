import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Specialty } from './entities/specialty.entity';

@Injectable()
export class SpecializationsService {
  constructor(
    @InjectRepository(Specialty)
    private readonly specialtyRepository: Repository<Specialty>,
  ) {}

  async findOne(identifier: number): Promise<Specialty | null> {
    return await this.specialtyRepository.findOneBy({ identifier });
  }

  async findAll(): Promise<Specialty[]> {
    return await this.specialtyRepository.find();
  }
}
