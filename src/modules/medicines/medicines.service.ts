import { BillingService } from '@modules/billing/billing.service';
import { RecordsService } from '@modules/records/records.service';
import { Physician } from '@modules/users/entities/physician.entity';
import { User } from '@modules/users/entities/user.entity';
import { UsersService } from '@modules/users/users.service';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import path from 'path';
import { ERROR_MESSAGES } from 'src/common/constants/error-messages';
import {
  EXPORT_PATH,
  PROCESS_PATH,
  TEMPLATE_PATH,
} from 'src/common/constants/others';
import { convertDataForExportPrescription } from 'src/common/files/utils/converter';
import { htmlToPdf } from 'src/common/files/utils/render';
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
    @Inject(forwardRef(() => RecordsService))
    private readonly recordsService: RecordsService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => BillingService))
    private readonly billingService: BillingService,
  ) {}

  async findOne(identifier: number): Promise<Medication | null> {
    return await this.medicationRepository.findOneBy({ identifier });
  }

  async findOnePrescription(
    identifier: number,
    isFull: boolean = false,
  ): Promise<Prescription | null> {
    if (!isFull) {
      return await this.prescriptionRepository.findOneBy({ identifier });
    }

    const prescription = await this.prescriptionRepository.findOne({
      where: { identifier },
      relations: [
        'prescribedMedications',
        'prescribedMedications.medication',
        'patientRecord',
        'patientRecord.patient',
        'physician',
      ],
    });
    prescription!.physician = (await this.usersService.findOnePhysician(
      prescription!.physicianIdentifier,
    )) as Physician;

    return prescription;
  }

  async findAll(): Promise<Medication[]> {
    return this.medicationRepository.find();
  }

  async findAllPrescriptionsOfCurrentUser(
    currentUser: User,
  ): Promise<Prescription[]> {
    const prescriptions = await this.prescriptionRepository.find({
      where: {
        patientRecord: {
          patientIdentifier: currentUser.identifier,
        },
      },
      relations: ['patientRecord'],
    });

    await Promise.all(
      prescriptions.map(async (prescription) => {
        prescription.specialtyServiceName = (
          await this.billingService.findOneSpecialtyServiceByPatientRecord(
            prescription.patientRecord.identifier,
          )
        )?.name;
        return prescription;
      }),
    );

    return prescriptions;
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
    const existedPatientRecordIdentifier = await this.recordsService.findOne(
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

  async exportPrescription(identifier: number): Promise<string> {
    const existedPrescription = await this.findOnePrescription(
      identifier,
      true,
    );
    if (!existedPrescription) {
      throw new HttpExceptionWrapper(ERROR_MESSAGES.PRESCRIPTION_NOT_FOUND);
    }

    // console.dir(existedPrescription, { depth: null, colors: true });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const data = convertDataForExportPrescription(existedPrescription);
    const templatePath: string = path.resolve(
      PROCESS_PATH,
      `${TEMPLATE_PATH}prescription.ejs`,
    );
    const exportFilePath: string = path.resolve(
      PROCESS_PATH,
      `${EXPORT_PATH}prescription.pdf`,
    );

    await htmlToPdf(templatePath, exportFilePath, data);
    return exportFilePath;
  }
}
