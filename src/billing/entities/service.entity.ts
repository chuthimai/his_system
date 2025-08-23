import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { InvoiceService } from './invoice-service.entity';
import { Location } from 'src/schedules/entities/location.entity';
import { AssessmentItem } from 'src/assessments/entities/assessment-item.entity';
import { ServiceReport } from 'src/reports/entities/service-report.entity';

@Entity('services')
export class Service {
  @PrimaryGeneratedColumn()
  identifier: number;

  @Column()
  type: string;

  @Column()
  name: string;

  @Column({ name: 'detail_description' })
  detailDescription: string;

  @Column()
  price: number;

  @Column()
  active: boolean;

  @Column({ name: 'location_identifier' })
  locationIdentifier: number;

  @OneToOne(() => Location, (location) => location.service)
  @JoinColumn({
    name: 'location_identifier',
    referencedColumnName: 'identifier',
  })
  location: Location;

  @OneToMany(() => InvoiceService, (invoiceService) => invoiceService.service)
  invoiceServices: InvoiceService[];

  @OneToMany(() => AssessmentItem, (assessmentItem) => assessmentItem.service)
  assessmentItems: AssessmentItem[];

  @OneToMany(() => ServiceReport, (serviceReport) => serviceReport.service)
  serviceReports: ServiceReport[];
}
