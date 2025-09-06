import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1757144268993 implements MigrationInterface {
  name = 'Migration1757144268993';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_79a90b964e495a6de20d6c07da9\``,
    );
    await queryRunner.query(
      `DROP INDEX \`REL_79a90b964e495a6de20d6c07da\` ON \`users\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` DROP COLUMN \`health_insurance_identity\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`physicians\` DROP FOREIGN KEY \`FK_61d4b65e1c463431eb038174e9f\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`physicians\` CHANGE \`specialty_identifier\` \`specialty_identifier\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`physicians\` CHANGE \`specialty_identifier\` \`specialty_identifier\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`physicians\` ADD CONSTRAINT \`FK_61d4b65e1c463431eb038174e9f\` FOREIGN KEY (\`specialty_identifier\`) REFERENCES \`specialties\`(\`identifier\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`physicians\` DROP FOREIGN KEY \`FK_61d4b65e1c463431eb038174e9f\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`invoices\` CHANGE \`copayment_waiver\` \`copayment_waiver\` int NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`physicians\` CHANGE \`specialty_identifier\` \`specialty_identifier\` int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`physicians\` CHANGE \`specialty_identifier\` \`specialty_identifier\` int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`physicians\` ADD CONSTRAINT \`FK_61d4b65e1c463431eb038174e9f\` FOREIGN KEY (\`specialty_identifier\`) REFERENCES \`specialties\`(\`identifier\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD \`health_insurance_identity\` int NOT NULL`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`REL_79a90b964e495a6de20d6c07da\` ON \`users\` (\`health_insurance_identity\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD CONSTRAINT \`FK_79a90b964e495a6de20d6c07da9\` FOREIGN KEY (\`health_insurance_identity\`) REFERENCES \`health_insurances\`(\`identifier\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
