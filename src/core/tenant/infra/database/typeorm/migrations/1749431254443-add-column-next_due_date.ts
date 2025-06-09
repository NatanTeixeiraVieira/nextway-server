import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumnNextDueDate1749431254443 implements MigrationInterface {
    name = 'AddColumnNextDueDate1749431254443'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tenant" ADD "next_due_date" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tenant" DROP COLUMN "next_due_date"`);
    }

}
