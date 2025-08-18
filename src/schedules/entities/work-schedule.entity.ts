import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Shift } from './shift.entity';
import { Location } from 'src/locations/entities/location.entity';
import { StaffWorkSchedule } from './staff-work-schedule.entity';

@Entity('work_schedules')
export class WorkSchedule {
  @PrimaryGeneratedColumn()
  identifier: number;

  @Column()
  date: string;

  @Column({ name: 'location_identifier' })
  locationIdentifier: number;

  @ManyToOne(() => Location, (location) => location.workSchedules)
  @JoinColumn({
    name: 'location_identifier',
    referencedColumnName: 'identifier',
  })
  location: Location;

  @Column({ name: 'shift_identifier' })
  shiftIdentifier: number;

  @ManyToOne(() => Shift, (shift) => shift.workSchedules)
  @JoinColumn({ name: 'shift_identifier', referencedColumnName: 'identifier' })
  shift: Shift;

  @OneToMany(
    () => StaffWorkSchedule,
    (staffWorkSchedule) => staffWorkSchedule.workSchedule,
  )
  staffWorkSchedules: StaffWorkSchedule[];
}
