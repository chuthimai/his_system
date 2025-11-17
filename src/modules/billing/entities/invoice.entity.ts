import { PatientRecord } from 'src/modules/records/entities/patient-record.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { InvoiceService } from './invoice-service.entity';

@Entity('invoices')
export class Invoice {
  @PrimaryGeneratedColumn()
  identifier: number;

  @Column({ default: 'VND' })
  currency: string;

  @Column({ default: 0 })
  total: number;

  @Column({ type: 'boolean', default: false }) // true ~ completed
  status: boolean;

  @Column({ name: 'payment_code', default: '' })
  paymentCode: string;

  @Column({
    name: 'created_time',
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdTime: string;

  @Column({
    name: 'paid_time',
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  paidTime: string;

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
