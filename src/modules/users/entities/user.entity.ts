import { Appointment } from '@modules/appointments/entities/appointment.entity';
import { PatientRecord } from 'src/modules/records/entities/patient-record.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  identifier: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  telecom: string;

  @Column({ name: 'birth_date', type: 'date' })
  birthDate: string;

  @Column()
  gender: boolean;

  @Column()
  address: string;

  @Column({ nullable: true })
  photo: string;

  @Column()
  password: string;

  @Column()
  role: string;

  @Column({ name: 'device_token', default: '' })
  deviceToken: string;

  @OneToMany(() => Appointment, (appointment) => appointment.user)
  appointments: Appointment[];

  @OneToMany(() => PatientRecord, (patientRecord) => patientRecord.patient)
  patientRecords: PatientRecord[];
}
