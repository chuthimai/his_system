import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Staff } from './entities/staff.entity';
import { Physician } from './entities/physician.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { ERROR_MESSAGES } from 'src/constants/error-messages';

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
      where: {
        identifier,
        staff: { active: true },
      },
      relations: ['staff', 'staff.user'],
    });

    if (!physician) return null;

    const { staff, ...physicianWithoutStaff } = physician;
    const { user, ...staffWithoutUser } = staff as Staff;
    return { ...physicianWithoutStaff, ...staffWithoutUser, ...user };
  }

  async create(
    createUserDto: CreateUserDto,
    reuseOnDuplicate: boolean = false,
  ): Promise<User> {
    const existedUser = await this.userRepository.findOneBy({
      telecom: createUserDto.telecom,
    });

    if (existedUser) {
      if (reuseOnDuplicate) return existedUser;
      else
        throw new HttpException(
          ERROR_MESSAGES.USER_ALREADY_EXISTS,
          HttpStatus.BAD_REQUEST,
        );
    }

    const newUser = this.userRepository.create({
      ...createUserDto,
      role: 'USER',
    });

    return this.userRepository.save(newUser);
  }

  async search(name: string): Promise<User[]> {
    return await this.userRepository
      .createQueryBuilder('user')
      .select([
        'user.identifier',
        'user.name',
        'user.email',
        'user.telecom',
        'user.birthDate',
        'user.gender',
      ])
      .where('LOWER(user.name) LIKE LOWER(:name)', { name: `%${name}%` })
      .getMany();
  }
}
