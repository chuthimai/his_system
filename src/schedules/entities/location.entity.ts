import { Service } from 'src/billing/entities/service.entity';
import { WorkSchedule } from 'src/schedules/entities/work-schedule.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { JoinColumn } from 'typeorm';

@Entity('locations')
export class Location {
  @PrimaryGeneratedColumn()
  identifier: number;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column({ name: 'parent_location_identifier' })
  parentLocationIdentifier: number;

  @ManyToOne(() => Location, (location) => location.children)
  @JoinColumn({
    name: 'parent_location_identifier',
    referencedColumnName: 'identifier',
  })
  parentLocation: Location;

  @OneToMany(() => Location, (location) => location.parentLocation)
  children: Location[];

  @OneToMany(() => WorkSchedule, (workSchedule) => workSchedule.location)
  workSchedules: WorkSchedule[];

  @OneToOne(() => Service, (service) => service.location)
  service: Service;
}
