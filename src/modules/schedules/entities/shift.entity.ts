import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { WorkSchedule } from './work-schedule.entity';

@Entity('shifts')
export class Shift {
  @PrimaryGeneratedColumn()
  identifier: number;

  @Column()
  name: string;

  @Column({ name: 'start_time', type: 'time' })
  startTime: string;

  @Column({ name: 'end_time', type: 'time' })
  endTime: string;

  @OneToMany(() => WorkSchedule, (workSchedule) => workSchedule.shift)
  workSchedules: WorkSchedule[];
}
