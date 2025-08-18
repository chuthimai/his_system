import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { WorkSchedule } from './work-schedule.entity';

@Entity('shifts')
export class Shift {
  [x: string]: any;
  @PrimaryGeneratedColumn()
  identifier: number;

  @Column()
  name: string;

  @Column({ name: 'start_time' })
  startTime: string;

  @Column({ name: 'end_time' })
  endTime: string;

  @OneToMany(() => WorkSchedule, (workSchedule) => workSchedule.shift)
  workSchedules: WorkSchedule[];
}
