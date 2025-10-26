import { RecordsService } from '@modules/records/records.service';
import { User } from '@modules/users/entities/user.entity';
import { UsersService } from '@modules/users/users.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ERROR_MESSAGES } from 'src/common/constants/error-messages';
import { HttpExceptionWrapper } from 'src/common/helpers/http-exception-wrapper';
import { Repository } from 'typeorm';

import { CreatePrescribedMedicationDto } from './dto/create-prescribed-medication.dto';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { PrescribeMedicineDto } from './dto/prescribe-medicine.dto';
import { Medication } from './entities/medication.entity';
import { PrescribedMedication } from './entities/prescribed-medication.entity';
import { Prescription } from './entities/prescription.entity';

@Injectable()
export class MedicinesService {
  constructor(
    @InjectRepository(Medication)
    private readonly medicationRepository: Repository<Medication>,
    @InjectRepository(Prescription)
    private readonly prescriptionRepository: Repository<Prescription>,
    @InjectRepository(PrescribedMedication)
    private readonly prescribedMedicationRepository: Repository<PrescribedMedication>,
    private readonly recordsService: RecordsService,
    private readonly usersService: UsersService,
  ) {}

  async findAll(): Promise<Medication[]> {
    return this.medicationRepository.find();
  }

  async findOne(identifier: number): Promise<Medication | null> {
    return await this.medicationRepository.findOneBy({ identifier });
  }

  async findOnePrescription(identifier: number): Promise<Prescription | null> {
    return await this.prescriptionRepository.findOneBy({ identifier });
  }

  async createPrescription(
    createPrescriptionDto: CreatePrescriptionDto,
  ): Promise<Prescription | null> {
    const existedPhysician = await this.usersService.findOnePhysician(
      createPrescriptionDto.physicianIdentifier,
    );
    if (!existedPhysician) {
      throw new HttpExceptionWrapper(ERROR_MESSAGES.PHYSICIAN_NOT_FOUND);
    }

    const newPrescription = this.prescriptionRepository.create(
      createPrescriptionDto,
    );
    return await this.prescriptionRepository.save(newPrescription);
  }

  async createPrescribedMedication(
    createPrescribedMedicationDto: CreatePrescribedMedicationDto,
    needCheckPrescription: boolean = true,
  ): Promise<PrescribedMedication | null> {
    if (needCheckPrescription) {
      const existedPrescription = await this.findOnePrescription(
        createPrescribedMedicationDto.prescriptionIdentifier,
      );
      if (!existedPrescription) {
        throw new HttpExceptionWrapper(ERROR_MESSAGES.PRESCRIPTION_NOT_FOUND);
      }
    }

    const existedMedication = await this.findOne(
      createPrescribedMedicationDto.medicationIdentifier,
    );
    if (!existedMedication) {
      throw new HttpExceptionWrapper(ERROR_MESSAGES.MEDICATION_NOT_FOUND);
    }

    const newPrescribedMedication = this.prescribedMedicationRepository.create(
      createPrescribedMedicationDto,
    );
    return await this.prescribedMedicationRepository.save(
      newPrescribedMedication,
    );
  }

  async prescribeMedicine(
    prescribedMedicineDto: PrescribeMedicineDto,
    currentUser: User,
  ): Promise<boolean> {
    const existedPatientRecordIdentifier =
      await this.recordsService.findOnePatientRecord(
        prescribedMedicineDto.patientRecordIdentifier,
      );
    if (!existedPatientRecordIdentifier) {
      throw new HttpExceptionWrapper(ERROR_MESSAGES.PATIENT_RECORD_NOT_FOUND);
    }

    // Maybe check bac si chu tri

    const createdPrescription = await this.createPrescription({
      advice: prescribedMedicineDto.advice,
      physicianIdentifier: currentUser.identifier,
    });
    if (!createdPrescription) {
      throw new HttpExceptionWrapper(ERROR_MESSAGES.CREATE_PRESCRIPTION_FAIL);
    }

    const createdPrescribedMedications = await Promise.all(
      prescribedMedicineDto.instructions.map((instruction) =>
        this.createPrescribedMedication(
          {
            quantity: instruction.quantity,
            dosageInstruction: instruction.dosageInstruction,
            medicationIdentifier: instruction.medicationIdentifier,
            prescriptionIdentifier: createdPrescription.identifier,
          },
          false,
        ),
      ),
    );
    if (!createdPrescribedMedications) {
      throw new HttpExceptionWrapper(
        ERROR_MESSAGES.CREATE_PRESCRIBED_MEDICATIONS_FAIL,
      );
    }

    existedPatientRecordIdentifier.prescriptionIdentifier =
      createdPrescription.identifier;
    const updatedPatientRecord = await this.recordsService.updatePatientRecord(
      existedPatientRecordIdentifier,
    );

    return updatedPatientRecord ? true : false;
  }
}
