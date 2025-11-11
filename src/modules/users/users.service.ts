import { RecordsService } from '@modules/records/records.service';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { ERROR_MESSAGES } from 'src/common/constants/error-messages';
import { ROLES } from 'src/common/constants/others';
import { HttpExceptionWrapper } from 'src/common/helpers/http-exception-wrapper';
import { Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { Physician } from './entities/physician.entity';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Physician)
    private readonly physicianRepository: Repository<Physician>,
    @Inject(forwardRef(() => RecordsService))
    private readonly recordsService: RecordsService,
  ) {}

  async findOne(
    identifier: number,
    isFull: boolean = false,
  ): Promise<User | null> {
    return isFull
      ? await this.userRepository.findOneBy({ identifier })
      : await this.userRepository.findOne({
          where: { identifier },
          select: [
            'identifier',
            'name',
            'telecom',
            'birthDate',
            'gender',
            'address',
          ],
        });
  }

  async findOneByPatientRecordIdentifier(
    patientRecordIdentifier: number,
  ): Promise<User | null> {
    const patientRecord = await this.recordsService.findOne(
      patientRecordIdentifier,
    );
    if (!patientRecord) {
      throw new HttpExceptionWrapper(ERROR_MESSAGES.PATIENT_RECORD_NOT_FOUND);
    }

    return await this.findOne(patientRecord.patientIdentifier);
  }

  async findOnePhysician(
    identifier: number,
    isFull: boolean = false,
    isActive: boolean = false,
  ): Promise<Physician | null> {
    const physician = await this.physicianRepository.findOne({
      where: {
        identifier,
        staff: isActive ? { active: true } : {},
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
          specialty: physician.specialty,
        } as Physician);
  }

  async findAllByName(name: string): Promise<User[]> {
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

  async create(
    createUserDto: CreateUserDto,
    reuseOnDuplicate: boolean = false,
  ): Promise<User> {
    const existedUser = await this.userRepository.findOneBy({
      telecom: createUserDto.telecom,
    });
    if (existedUser) {
      if (reuseOnDuplicate) {
        return existedUser;
      } else {
        throw new HttpExceptionWrapper(ERROR_MESSAGES.USER_ALREADY_EXISTS);
      }
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
