import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Shift } from './shift.entity';
import { StaffWorkSchedule } from './staff-work-schedule.entity';
import { Location } from './location.entity';
import { Appointment } from '@modules/appointments/entities/appointment.entity';

@Entity('work_schedules')
export class WorkSchedule {
  @PrimaryGeneratedColumn()
  identifier: number;

  @Column({ type: 'date' })
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

  @OneToMany(() => Appointment, (appointment) => appointment.workSchedule)
  appointments: Appointment[];
}
