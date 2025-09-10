import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Staff } from './entities/staff.entity';
import { Physician } from './entities/physician.entity';
import { promises } from 'dns';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,
    @InjectRepository(Physician)
    private readonly physicianRepository: Repository<Physician>,
  ) {}

  async findOne(identifier: number): Promise<User | null> {
    return await this.userRepository.findOneBy({ identifier });
  }

  async findOneStaff(identifier: number): Promise<Staff | null> {
    const staff = await this.staffRepository.findOne({
      where: { identifier },
      relations: ['user'],
    });

    if (!staff) return null;

    const { user, ...staffWithoutUser } = staff;
    return { ...staffWithoutUser, ...user };
  }

  async findOnePhysician(identifier: number): Promise<Physician | null> {
    const physician = await this.physicianRepository.findOne({
      where: { identifier },
      relations: ['staff', 'staff.user'],
    });

    if (!physician) return null;

    const { staff, ...physicianWithoutStaff } = physician;
    const { user, ...staffWithoutUser } = staff as Staff;
    return { ...physicianWithoutStaff, ...staffWithoutUser, ...user };
  }
}
