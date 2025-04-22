import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableUser1745261034015 implements MigrationInterface {
    name = 'CreateTableUser1745261034015'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying(255) NOT NULL, "email" character varying(255) NOT NULL, "password" character varying(100) NOT NULL, "phoneNumber" character varying(13), "emailVerified" TIMESTAMP, "forgotPasswordEmailVerificationToken" character varying(255), "active" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "UQ_user_email_active" ON "user" ("email") WHERE "deleted_at" IS NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."UQ_user_email_active"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
