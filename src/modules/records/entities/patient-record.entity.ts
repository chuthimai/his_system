import { Invoice } from 'src/modules/billing/entities/invoice.entity';
import { Prescription } from 'src/modules/medicines/entities/prescription.entity';
import { User } from 'src/modules/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('patient_records')
export class PatientRecord {
  @PrimaryGeneratedColumn()
  identifier: number;

  @Column({ type: 'boolean', default: false }) // true ~ completed
  status: boolean;

  @Column({
    name: 'created_time',
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdTime: Date;

  @Column({ name: 'prescription_identifier', nullable: true })
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

  @OneToMany(() => Invoice, (invoice) => invoice.patientRecord)
  invoices: Invoice[];
}
