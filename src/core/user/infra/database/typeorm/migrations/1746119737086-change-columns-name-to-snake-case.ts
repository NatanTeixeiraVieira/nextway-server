import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeColumnsNameToSnakeCase1746119737086 implements MigrationInterface {
    name = 'ChangeColumnsNameToSnakeCase1746119737086'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "phoneNumber"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "emailVerified"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "forgotPasswordEmailVerificationToken"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "phone_number" character varying(13)`);
        await queryRunner.query(`ALTER TABLE "user" ADD "email_verified" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "user" ADD "forgot_password_email_verification_token" character varying(255)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "forgot_password_email_verification_token"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "email_verified"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "phone_number"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "forgotPasswordEmailVerificationToken" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "user" ADD "emailVerified" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "user" ADD "phoneNumber" character varying(13)`);
    }

}
