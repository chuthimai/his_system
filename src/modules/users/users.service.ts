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
    return { ...staffWithoutUser, ...user } as unknown as Staff;
  }

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
      .select([
        'user.identifier',
        'user.name',
        'user.telecom',
        'user.birthDate',
        'user.gender',
        'user.address',
      ])
      .where('LOWER(user.name) LIKE LOWER(:name)', { name: `%${name}%` })
      .getMany();
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

    createUserDto.password = bcrypt.hashSync(createUserDto.password, 10);

    const newUser = this.userRepository.create({
      ...createUserDto,
      role: ROLES.PATIENT,
    });

    return await this.userRepository.save(newUser);
  }
}
