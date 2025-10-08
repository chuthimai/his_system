import { Injectable } from '@nestjs/common';
import { Specialty } from './entities/specialty.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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
