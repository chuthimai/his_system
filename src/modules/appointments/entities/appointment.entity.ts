import { WorkSchedule } from '@modules/schedules/entities/work-schedule.entity';
import { User } from '@modules/users/entities/user.entity';
import { Physician } from 'src/modules/users/entities/physician.entity';
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

  @Column({ name: 'cancellation_date', type: 'date', nullable: true })
  cancellationDate: string;

  @Column({ name: 'work_schedule_identifier' })
  workScheduleIdentifier: number;

  @ManyToOne(() => WorkSchedule, (workSchedule) => workSchedule.appointments)
  @JoinColumn({
    name: 'work_schedule_identifier',
    referencedColumnName: 'identifier',
  })
  workSchedule: WorkSchedule;

  @Column({ name: 'physician_identifier', nullable: true })
  physicianIdentifier: number;

  @ManyToOne(() => Physician, (physician) => physician.appointments)
  @JoinColumn({
    name: 'physician_identifier',
    referencedColumnName: 'identifier',
  })
  physician: Physician;

  @Column({ name: 'user_identifier' })
  userIdentifier: number;

  @ManyToOne(() => User, (user) => user.appointments)
  @JoinColumn({
    name: 'user_identifier',
    referencedColumnName: 'identifier',
  })
  user: User;
}
