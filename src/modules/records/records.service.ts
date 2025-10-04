import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateRecordDto } from './dto/create-record.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PatientRecord } from './entities/patient-record.entity';
import { Repository } from 'typeorm';
import { UsersService } from '@modules/users/users.service';
import { ERROR_MESSAGES } from 'src/constants/error-messages';
import { CreateUserDto } from '@modules/users/dto/create-user.dto';
import { User } from '@modules/users/entities/user.entity';

@Injectable()
export class RecordsService {
  constructor(
    @InjectRepository(PatientRecord)
    private readonly patientRecordRepository: Repository<PatientRecord>,
    private readonly usersService: UsersService,
  ) {}

  // Must have information: base, patient
  async create(
    createRecordDto: CreateRecordDto,
  ): Promise<PatientRecord | null> {
    let patient: User | null;

    if (!createRecordDto.patientIdentifier) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { patientIdentifier, ...userData } = createRecordDto;
      patient = await this.usersService.create(userData as CreateUserDto, true);
    } else {
      patient = await this.usersService.findOne(
        createRecordDto.patientIdentifier,
      );
    }

    if (!patient) {
      throw new HttpException(
        ERROR_MESSAGES.PATIENT_NOT_FOUND,
        HttpStatus.BAD_REQUEST,
      );
    }

    const newPatientRecord = this.patientRecordRepository.create({
      patientIdentifier: patient.identifier,
    });

    const savedPatientRecord =
      await this.patientRecordRepository.save(newPatientRecord);

    return await this.patientRecordRepository
      .createQueryBuilder('record')
      .where('record.identifier = :id', { id: savedPatientRecord.identifier })
      .leftJoin('record.patient', 'patient')
      .addSelect([
        'patient.identifier',
        'patient.name',
        'patient.telecom',
        'patient.birthDate',
        'patient.gender',
        'patient.address',
      ])
      .getOne();
  }
}
