import { StaffWorkSchedule } from 'src/modules/schedules/entities/staff-work-schedule.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';

import { Physician } from './physician.entity';
import { User } from './user.entity';

@Entity('staffs')
export class Staff {
  @PrimaryColumn()
  identifier: number;

  @OneToOne(() => User, { cascade: true })
  @JoinColumn({ name: 'identifier' })
  user: User;

  @OneToOne(() => Physician, (physician) => physician.staff)
  physician: Physician;

  name?: string;
  telecom?: string;
  email?: string;
  gender?: string;
  birthDate?: string;
  photo?: string;
  password?: string;
  role: string;
  address: string;

  @Column({ type: 'boolean', default: true }) // false ~ quit
  active: boolean;

  @Column({ name: 'start_date', type: 'date' })
  startDate: string;

  @Column({ name: 'end_date', type: 'date', nullable: true })
  endDate: string;

  @OneToMany(
    () => StaffWorkSchedule,
    (staffWorkSchedule) => staffWorkSchedule.staff,
  )
  staffWorkSchedules: StaffWorkSchedule[];
}
