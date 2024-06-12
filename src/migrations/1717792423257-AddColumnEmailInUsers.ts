import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddColumnEmailInUsers1717792423257 implements MigrationInterface {
  name = 'AddColumnEmailInUsers1717792423257';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "email" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "email"`);
  }
}
