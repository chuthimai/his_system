import { Injectable } from '@nestjs/common';
import { CreatePatientRecordDto } from './dto/create-patient-record.dto';
import { UpdatePatientRecordDto } from './dto/update-patient-record.dto';

@Injectable()
export class PatientRecordsService {
  create(createPatientRecordDto: CreatePatientRecordDto) {
    return 'This action adds a new patientRecord';
  }

  findAll() {
    return `This action returns all patientRecords`;
  }

  findOne(id: number) {
    return `This action returns a #${id} patientRecord`;
  }

  update(id: number, updatePatientRecordDto: UpdatePatientRecordDto) {
    return `This action updates a #${id} patientRecord`;
  }

  remove(id: number) {
    return `This action removes a #${id} patientRecord`;
  }
}
