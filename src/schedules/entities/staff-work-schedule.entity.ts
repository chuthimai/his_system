import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { WorkSchedule } from './work-schedule.entity';
import { Staff } from 'src/users/entities/staff.entity';
import { Appointment } from 'src/appointments/entities/appointment.entity';

@Entity('staff_work_schedules')
export class StaffWorkSchedule {
  @PrimaryGeneratedColumn()
  identifier: number;

  @Column()
  duty: string;

  @Column()
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

  @Column({ name: 'staff_identifier' })
  staffIdentifier: number;

  @ManyToOne(() => Staff, (staff) => staff.staffWorkSchedules)
  @JoinColumn({ name: 'staff_identifier', referencedColumnName: 'identifier' })
  staff: Staff;

  @OneToMany(() => Appointment, (appointment) => appointment.staffWorkSchedule)
  appointments: Appointment[];
}
