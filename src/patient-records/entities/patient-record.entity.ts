import { Prescription } from 'src/medicines/entities/prescription.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('patient_records')
export class PatientRecord {
  @PrimaryGeneratedColumn()
  identifier: number;

  @Column()
  status: boolean;

  @Column({ name: 'created_time' })
  createdTime: string;

  @Column({ name: 'prescription_identifier' })
  prescriptionIdentifier: number;

  @OneToOne(() => Prescription, (prescription) => prescription.patientRecord)
  @JoinColumn({
    name: 'prescription_identifier',
    referencedColumnName: 'identifier',
  })
  prescription: Prescription;

  @Column({ name: 'patient_identifier' })
  patientIdentifier: number;

  @ManyToOne(() => User, (patient) => patient.patientRecords)
  @JoinColumn({
    name: 'patient_identifier',
    referencedColumnName: 'identifier',
  })
  patient: User;
}
