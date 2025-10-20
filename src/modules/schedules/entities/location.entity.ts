import { Service } from 'src/modules/billing/entities/service.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { JoinColumn } from 'typeorm';

import { StaffWorkSchedule } from './staff-work-schedule.entity';

@Entity('locations')
export class Location {
  @PrimaryGeneratedColumn()
  identifier: number;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column({ name: 'parent_identifier', nullable: true })
  parentIdentifier: number;

  @ManyToOne(() => Location, (location) => location.children)
  @JoinColumn({
    name: 'parent_identifier',
    referencedColumnName: 'identifier',
  })
  parent: Location;

  @OneToMany(() => Location, (location) => location.parent)
  children: Location[];

  @OneToMany(
    () => StaffWorkSchedule,
    (staffWorkSchedule) => staffWorkSchedule.location,
  )
  staffWorkSchedules: StaffWorkSchedule[];

  @OneToMany(() => Service, (service) => service.location)
  services: Service[];
}
