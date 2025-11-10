import { AssessmentItem } from '@modules/assessments/entities/assessment-item.entity';
import { MeasurementItems } from '@modules/assessments/entities/measurement-item.entity';
import { Service } from '@modules/billing/entities/service.entity';
import { Medication } from '@modules/medicines/entities/medication.entity';
import { Location } from '@modules/schedules/entities/location.entity';
import { Shift } from '@modules/schedules/entities/shift.entity';
import { StaffWorkSchedule } from '@modules/schedules/entities/staff-work-schedule.entity';
import { WorkSchedule } from '@modules/schedules/entities/work-schedule.entity';
import { Qualification } from '@modules/specializations/entities/qualification.entity';
import { Specialty } from '@modules/specializations/entities/specialty.entity';
import { Physician } from '@modules/users/entities/physician.entity';
import { Staff } from '@modules/users/entities/staff.entity';
import { User } from '@modules/users/entities/user.entity';
import { AppDataSource } from 'data-source';
import { EntityTarget, ObjectLiteral } from 'typeorm';

import {
  AssessmentItemData,
  LocationData,
  MeasurementItemData,
  MedicationData,
  PhysicianData,
  QualificationData,
  ServiceData,
  ShiftData,
  SpecialtyData,
  StaffData,
  StaffWorkScheduleData,
  UserData,
  WorkScheduleData,
} from './initial-data';

const entitiesAndData = [
  [Specialty, SpecialtyData],
  [User, UserData],
  [Staff, StaffData],
  [Physician, PhysicianData],
  [Qualification, QualificationData],
  [Location, LocationData],
  [Service, ServiceData],
  [Shift, ShiftData],
  [WorkSchedule, WorkScheduleData],
  [StaffWorkSchedule, StaffWorkScheduleData],
  [AssessmentItem, AssessmentItemData],
  [MeasurementItems, MeasurementItemData],
  [Medication, MedicationData],
];

async function clearAllTablesSafely(dataSource: typeof AppDataSource) {
  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();

  await queryRunner.query('SET FOREIGN_KEY_CHECKS = 0;');

  try {
    const entities = dataSource.entityMetadatas;
    for (const entity of entities) {
      const repository = queryRunner.manager.getRepository(entity.name);
      await repository.clear();
    }

    // eslint-disable-next-line no-useless-catch
  } catch (err) {
    throw err;
  } finally {
    await queryRunner.release();
  }
}

async function seed() {
  const dataSource = !AppDataSource.isInitialized
    ? await AppDataSource.initialize()
    : AppDataSource;

  await clearAllTablesSafely(dataSource);

  for (const [Entity, data] of entitiesAndData as unknown as [
    EntityTarget<ObjectLiteral>,
    ObjectLiteral[],
  ][]) {
    const repository = dataSource.getRepository(Entity);
    await repository.save(data);
  }

  await dataSource.destroy();
}

if (require.main === module) {
  seed().catch((error) => {
    console.error('Error during seeding:', error);
  });
}
