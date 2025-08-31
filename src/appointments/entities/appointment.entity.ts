import { StaffWorkSchedule } from 'src/schedules/entities/staff-work-schedule.entity';
import { Physician } from 'src/users/entities/physician.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn()
  identifier: number;

  @Column({ type: 'boolean', default: true }) // false ~ cancelled
  status: boolean;

  @Column({ nullable: true })
  reason: string;

  @Column({ name: 'cancellation_date', nullable: true })
  cancellationDate: string;

  @Column({ name: 'staff_work_schedule_identifier' })
  staffWorkScheduleIdentifier: number;

  @ManyToOne(
    () => StaffWorkSchedule,
    (staffWorkSchedule) => staffWorkSchedule.appointments,
  )
  @JoinColumn({
    name: 'staff_work_schedule_identifier',
    referencedColumnName: 'identifier',
  })
  staffWorkSchedule: StaffWorkSchedule;

  @Column({ name: 'physician_identifier' })
  physicianIdentifier: number;

  @ManyToOne(() => Physician, (physician) => physician.appointments)
  @JoinColumn({
    name: 'physician_identifier',
    referencedColumnName: 'identifier',
  })
  physician: Physician;
}
