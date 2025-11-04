import { PatientRecord } from 'src/modules/records/entities/patient-record.entity';
import { Physician } from 'src/modules/users/entities/physician.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { PrescribedMedication } from './prescribed-medication.entity';

@Entity('prescriptions')
export class Prescription {
  @PrimaryGeneratedColumn()
  identifier: number;

  @Column()
  advice: string;

  @Column({
    name: 'create_time',
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdTime: string;

  @OneToMany(
    () => PrescribedMedication,
    (prescribedMedication) => prescribedMedication.prescription,
  )
  prescribedMedications: PrescribedMedication[];

  @Column({ name: 'physician_identifier' })
  physicianIdentifier: number;

  @ManyToOne(() => Physician, (physician) => physician.prescriptions)
  @JoinColumn({
    name: 'physician_identifier',
    referencedColumnName: 'identifier',
  })
  physician: Physician;

  @OneToOne(() => PatientRecord, (patientRecord) => patientRecord.prescription)
  patientRecord: PatientRecord;

  specialtyServiceName?: string;
}
