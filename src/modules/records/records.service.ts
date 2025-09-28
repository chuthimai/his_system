import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { CreateRecordDto } from './dto/create-record.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PatientRecord } from './entities/patient-record.entity';
import { Repository } from 'typeorm';
import { UsersService } from '@modules/users/users.service';
import { ERROR_MESSAGES } from 'src/constants/error-messages';
import { CreateUserDto } from '@modules/users/dto/create-user.dto';

@Injectable()
export class RecordsService {
  constructor(
    @InjectRepository(PatientRecord)
    private readonly patientRecordRepository: Repository<PatientRecord>,
    private readonly usersService: UsersService,
  ) {}

  async create(createRecordDto: CreateRecordDto) {
    let patient;

    if (!createRecordDto.patientIdentifier) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { patientIdentifier, ...userData } = createRecordDto;
      patient = await this.usersService.create(userData as CreateUserDto, true);
    } else {
      patient = await this.usersService.findOne(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        createRecordDto.patientIdentifier ?? patient.identifier,
      );
    }

    if (!patient) {
      throw new HttpException(
        ERROR_MESSAGES.PATIENT_NOT_FOUND,
        HttpStatus.BAD_REQUEST,
      );
    }

    const newPatientRecord = this.patientRecordRepository.create({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      patientIdentifier: patient.identifier as number,
    });

    const savedPatientRecord =
      await this.patientRecordRepository.save(newPatientRecord);

    return await this.patientRecordRepository
      .createQueryBuilder('record')
      .select('record')
      .addSelect([
        'patient.name',
        'patient.telecom',
        'patient.birthDate',
        'patient.gender',
        'patient.address',
      ])
      .leftJoin('record.patient', 'patient')
      .where('record.identifier = :id', { id: savedPatientRecord.identifier })
      .getOne();
  }
}
