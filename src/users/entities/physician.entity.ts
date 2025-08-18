import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { Staff } from './staff.entity';
import { Qualification } from 'src/specializations/entities/qualification.entity';
import { Specialty } from 'src/specializations/entities/specialty.entity';
import { Appointment } from 'src/appointments/entities/appointment.entity';

@Entity('physicians')
export class Physician {
  [x: string]: any;
  @PrimaryColumn()
  identifier: number;

  @OneToOne(() => Staff, { cascade: true })
  @JoinColumn({ name: 'identifier' })
  staff: Staff;

  @OneToMany(() => Qualification, (qualification) => qualification.physician)
  qualifications: Qualification[];

  @Column({ name: 'specialty_identifier' })
  specialtyIdentifier: number;

  @ManyToOne(() => Specialty, (specialty) => specialty.physicians)
  @JoinColumn({
    name: 'specialty_identifier',
    referencedColumnName: 'identifier',
  })
  specialty: Specialty;

  @OneToMany(() => Appointment, (appointment) => appointment.physician)
  appointments: Appointment[];
}
