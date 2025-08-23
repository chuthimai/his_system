import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { InvoiceService } from './invoice-service.entity';

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

  @Column()
  status: boolean;

  @Column({ name: 'created_time' })
  createdTime: boolean;

  @OneToMany(() => InvoiceService, (invoiceService) => invoiceService.invoice)
  invoiceServices: InvoiceService[];
}
