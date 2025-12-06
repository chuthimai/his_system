import { Staff } from 'src/modules/users/entities/staff.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Location } from './location.entity';
import { WorkSchedule } from './work-schedule.entity';

@Entity('staff_work_schedules')
export class StaffWorkSchedule {
  @PrimaryGeneratedColumn()
  identifier: number;

  @Column()
  duty: string;

  @Column({ type: 'boolean', default: true }) // false ~ day off work
  active: boolean;

  @Column({ name: 'work_schedule_identifier' })
  workScheduleIdentifier: number;

  @ManyToOne(
    () => WorkSchedule,
    (workSchedule) => workSchedule.staffWorkSchedules,
  )
  @JoinColumn({
    name: 'work_schedule_identifier',
    referencedColumnName: 'identifier',
  })
  workSchedule: WorkSchedule;

  @Column({ name: 'staff_identifier', type: 'bigint', unsigned: true })
  staffIdentifier: number;

  @ManyToOne(() => Staff, (staff) => staff.staffWorkSchedules)
  @JoinColumn({ name: 'staff_identifier', referencedColumnName: 'identifier' })
  staff: Staff;

  @Column({ name: 'location_identifier' })
  locationIdentifier: number;

  @ManyToOne(() => Location, (location) => location.staffWorkSchedules)
  @JoinColumn({
    name: 'location_identifier',
    referencedColumnName: 'identifier',
  })
  location: Location;

  // @OneToMany(() => Appointment, (appointment) => appointment.staffWorkSchedule)
  // appointments: Appointment[];
}
