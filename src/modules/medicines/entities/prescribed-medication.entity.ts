import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Medication } from './medication.entity';
import { Prescription } from './prescription.entity';

@Entity('prescribed_medications')
export class PrescribedMedication {
  @PrimaryGeneratedColumn()
  identifier: number;

  @Column()
  quantity: number;

  @Column({ name: 'dose_instruction' })
  dosageInstruction: string;

  @Column({ name: 'medication_identifier' })
  medicationIdentifier: number;

  @ManyToOne(() => Medication, (medication) => medication.prescribedMedications)
  @JoinColumn({
    name: 'medication_identifier',
    referencedColumnName: 'identifier',
  })
  medication: Medication;

  @Column({ name: 'prescription_identifier' })
  prescriptionIdentifier: number;

  @ManyToOne(
    () => Prescription,
    (prescription) => prescription.prescribedMedications,
  )
  @JoinColumn({
    name: 'prescription_identifier',
    referencedColumnName: 'identifier',
  })
  prescription: Prescription;
}
