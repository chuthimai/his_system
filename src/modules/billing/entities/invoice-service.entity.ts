import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Invoice } from './invoice.entity';
import { Service } from './service.entity';

@Entity('invoice_services')
export class InvoiceService {
  @PrimaryGeneratedColumn()
  identifier: number;

  @Column({ name: 'invoice_identifier' })
  invoiceIdentifier: number;

  @ManyToOne(() => Invoice, (invoice) => invoice.invoiceServices)
  @JoinColumn({
    name: 'invoice_identifier',
    referencedColumnName: 'identifier',
  })
  invoice: Invoice;

  @Column({ name: 'service_identifier' })
  serviceIdentifier: number;

  @Column({ default: 0 })
  price: number;

  @ManyToOne(() => Service, (service) => service.invoiceServices)
  @JoinColumn({
    name: 'service_identifier',
    referencedColumnName: 'identifier',
  })
  service: Service;
}
