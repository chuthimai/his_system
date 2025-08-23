import { Service } from 'src/billing/entities/service.entity';
import { Physician } from 'src/users/entities/physician.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('service_reports')
export class ServiceReport {
  @PrimaryGeneratedColumn()
  identifier: number;

  @Column()
  category: string;

  @Column()
  method: string;

  @Column()
  status: boolean;

  @Column({ name: 'effective_time' })
  effectiveTime: string;

  @Column({ name: 'record_time' })
  recordedTime: string;

  @Column({ name: 'service_identifier' })
  serviceIdentifier: number;

  @ManyToOne(() => Service, (service) => service.serviceReports)
  @JoinColumn({
    name: 'service_identifier',
    referencedColumnName: 'identifier',
  })
  service: Service;

  @Column({ name: 'performer_identifier' })
  performerIdentifier: number;

  @ManyToOne(
    () => Physician,
    (performer) => performer.servicePerformanceReports,
  )
  @JoinColumn({
    name: 'performer_identifier',
    referencedColumnName: 'identifier',
  })
  performer: Physician;

  @Column({ name: 'requester_identifier' })
  requesterIdentifier: number;

  @ManyToOne(() => Physician, (requester) => requester.serviceRequestReports)
  @JoinColumn({
    name: 'requester_identifier',
    referencedColumnName: 'identifier',
  })
  requester: Physician;
}
