import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { User } from './user.entity';
import { StaffWorkSchedule } from 'src/modules/schedules/entities/staff-work-schedule.entity';

@Entity('staffs')
export class Staff {
  @PrimaryColumn()
  identifier: number;

  @OneToOne(() => User, { cascade: true })
  @JoinColumn({ name: 'identifier' })
  user: User;

  name?: string;
  telecom?: string;
  email?: string;
  gender?: string;
  birthDate?: string;
  photo?: string;
  password?: string;
  role: string;

  @Column()
  address: string;

  @Column({ type: 'boolean', default: true }) // false ~ quit
  active: boolean;

  @Column({ name: 'start_date', type: 'date' })
  startDate: string;

  @Column({ name: 'end_date', type: 'date' })
  endDate: string;

  @OneToMany(
    () => StaffWorkSchedule,
    (staffWorkSchedule) => staffWorkSchedule.staff,
  )
  staffWorkSchedules: StaffWorkSchedule[];
}
