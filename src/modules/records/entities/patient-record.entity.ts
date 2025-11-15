import { ServiceReport } from '@modules/reports/entities/service-report.entity';
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

  @Column({ name: 'having_referral_letter', type: 'boolean', default: 0 })
  havingTransferForm: boolean;

  @Column({ name: 'having_heath_insurance', type: 'boolean', default: 0 })
  havingHealInsurance: boolean;

  @Column({ name: 'export_file_name', default: '' })
  exportFileName: string;

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

  @OneToMany(
    () => ServiceReport,
    (serviceReport) => serviceReport.patientRecord,
  )
  serviceReports: ServiceReport[];

  @OneToMany(() => Invoice, (invoice) => invoice.patientRecord)
  invoices: Invoice[];
}
