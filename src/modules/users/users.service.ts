import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Staff } from './entities/staff.entity';
import { Physician } from './entities/physician.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { ERROR_MESSAGES } from 'src/constants/error-messages';
import * as bcrypt from 'bcrypt';
import { ROLES } from 'src/constants/others';

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

  // For check existence, get full information in auth/login (all info)
  // For check existence in records/create (just check existence)
  // For check existence in appointments/create (just check existence)
  async findOne(identifier: number): Promise<User | null> {
    return await this.userRepository.findOneBy({ identifier });
  }

  // For check existence, get full information in auth/login (all info)
  // For check existence in schedules/work-schedules-by-condition (just check existence)
  // For check existence, get base information in appointments/create (base info)
  // For check existence in schedules/staff-work-schedule-by-condition (just check existence)
  async findOnePhysician(
    identifier: number,
    isFull: boolean = true,
  ): Promise<Physician | null> {
    const physician = await this.physicianRepository.findOne({
      where: {
        identifier,
        staff: { active: true },
      },
      relations: ['staff', 'staff.user', 'specialty', 'qualifications'],
    });

    if (!physician) return null;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { specialtyIdentifier, staff, ...physicianWithoutStaff } = physician;
    const { user, ...staffWithoutUser } = staff;
    return isFull
      ? ({
          ...physicianWithoutStaff,
          ...staffWithoutUser,
          ...user,
          specialty: physician.specialty,
          qualifications: physician.qualifications,
        } as unknown as Physician)
      : ({
          identifier: physician.identifier,
          name: physician?.staff?.user?.name,
        } as Physician);
  }

  async findAllPhysicianBySpecialty(
    specialtyIdentifier: number,
  ): Promise<Physician[]> {
    const physicians = await this.physicianRepository.find({
      where: {
        specialtyIdentifier,
        staff: { active: true },
      },
      relations: ['staff', 'staff.user'],
    });

    return physicians.map((physician) => {
      return {
        identifier: physician.identifier,
        name: physician?.staff?.user?.name,
      } as Physician;
    });
  }

  async searchByName(name: string): Promise<User[]> {
    return await this.userRepository
      .createQueryBuilder('user')
      .where('LOWER(user.name) LIKE LOWER(:name)', { name: `%${name}%` })
      .select([
        'user.identifier',
        'user.name',
        'user.telecom',
        'user.birthDate',
        'user.gender',
        'user.address',
      ])
      .getMany();
  }

  // For create patient in records/create (all info)
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

    createUserDto.password = bcrypt.hashSync(createUserDto.password, 10);

    const newUser = this.userRepository.create({
      identifier: Number('111' + (Date.now() % 1e7)),
      ...createUserDto,
      role: ROLES.PATIENT,
    });

    return await this.userRepository.save(newUser);
  }
}
