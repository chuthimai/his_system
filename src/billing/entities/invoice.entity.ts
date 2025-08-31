import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { InvoiceService } from './invoice-service.entity';
import { PatientRecord } from 'src/records/entities/patient-record.entity';

@Entity('invoices')
export class Invoice {
  @PrimaryGeneratedColumn()
  identifier: number;

  @Column()
  currency: string;

  @Column({ name: 'copayment_waiver' })
  copaymentWaiver: number;

  @Column({ name: 'total_gross' })
  totalGross: number;

  @Column({ type: 'boolean', default: false }) // true ~ completed
  status: boolean;

  @Column({ name: 'created_time', type: 'datetime' })
  createdTime: boolean;

  @OneToMany(() => InvoiceService, (invoiceService) => invoiceService.invoice)
  invoiceServices: InvoiceService[];

  @Column({ name: 'patient_record_identifier' })
  patientRecordIdentifier: number;

  @ManyToOne(() => PatientRecord, (patientRecord) => patientRecord.invoices)
  @JoinColumn({
    name: 'patient_record_identifier',
    referencedColumnName: 'identifier',
  })
  patientRecord: PatientRecord;
}
