import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTablesTenant1745262397514 implements MigrationInterface {
    name = 'CreateTablesTenant1745262397514'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "public"."state" ("id" SERIAL NOT NULL, "name" character varying(20) NOT NULL, "uf" character varying(2) NOT NULL, CONSTRAINT "PK_549ffd046ebab1336c3a8030a12" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "public"."banner" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "imagePath" character varying(70) NOT NULL, "active" boolean NOT NULL, "tenant_id" uuid, CONSTRAINT "PK_6d9e2570b3d85ba37b681cd4256" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "public"."delivery" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "deliveryRadiusKm" numeric(4,1) NOT NULL, "deliveryPrice" numeric(9,2) NOT NULL, "tenant_id" uuid, CONSTRAINT "PK_ffad7bf84e68716cd9af89003b0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "public"."opening_hour" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "start" character varying(5) NOT NULL, "end" character varying(5) NOT NULL, "weekday_id" integer, "tenant_id" uuid, CONSTRAINT "PK_6551ceb95c04da8afd85da470c9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "public"."plan" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(30) NOT NULL, "price" numeric(6,2) NOT NULL, CONSTRAINT "PK_54a2b686aed3b637654bf7ddbb3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "public"."tenant" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "responsibleName" character varying(255) NOT NULL, "responsibleCpf" character varying(11) NOT NULL, "email" character varying(255) NOT NULL, "responsiblePhoneNumber" character varying(13) NOT NULL, "zipcode" character varying(8) NOT NULL, "neighborhood" character varying(50) NOT NULL, "street" character varying(100) NOT NULL, "streetNumber" character varying(10) NOT NULL, "longitude" numeric(10,7) NOT NULL, "latitude" numeric(10,7) NOT NULL, "cnpj" character varying(14) NOT NULL, "corporateReason" character varying(255) NOT NULL, "establishmentName" character varying(255) NOT NULL, "establishmentPhoneNumber" character varying(13), "slug" character varying(255) NOT NULL, "password" character varying(100) NOT NULL, "mainColor" character varying(7) NOT NULL, "coverImagePath" character varying(255), "logoImagePath" character varying(255), "description" text, "emailVerified" TIMESTAMP, "verifyEmailCode" character varying(6), "forgotPasswordEmailVerificationToken" character varying(255), "active" boolean NOT NULL DEFAULT true, "cityId" integer, "plan_id" uuid, CONSTRAINT "UQ_5b5d9635409048b7144f5f23198" UNIQUE ("email"), CONSTRAINT "UQ_7b94c14f79c0b1325b362afa902" UNIQUE ("cnpj"), CONSTRAINT "UQ_abfd243f7bd832e806d19c5a919" UNIQUE ("slug"), CONSTRAINT "PK_da8c6efd67bb301e810e56ac139" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "UQ_tenant_slug_active" ON "public"."tenant" ("slug") WHERE "deleted_at" IS NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX "UQ_tenant_email_active" ON "public"."tenant" ("email") WHERE "deleted_at" IS NULL`);
        await queryRunner.query(`CREATE TABLE "public"."city" ("id" SERIAL NOT NULL, "name" character varying(20) NOT NULL, "state_id" integer, CONSTRAINT "PK_b222f51ce26f7e5ca86944a6739" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "public"."weekday" ("id" SERIAL NOT NULL, "name" character varying(7) NOT NULL, "shortName" character varying(4) NOT NULL, CONSTRAINT "PK_513bca9acbf0c2597a8c599c514" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "public"."banner" ADD CONSTRAINT "FK_515dc8f2c16fa70dc07f02ab565" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "public"."delivery" ADD CONSTRAINT "FK_fab087f3d65c8aa342ef628a456" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "public"."opening_hour" ADD CONSTRAINT "FK_ba82714f12f7a13769cde630863" FOREIGN KEY ("weekday_id") REFERENCES "public"."weekday"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "public"."opening_hour" ADD CONSTRAINT "FK_0dcd4e24f4098dd694b329fbecd" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "public"."tenant" ADD CONSTRAINT "FK_02cc2270193a6410fe159e2e126" FOREIGN KEY ("cityId") REFERENCES "public"."city"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "public"."tenant" ADD CONSTRAINT "FK_ec1ebacb05d922fc744567258e6" FOREIGN KEY ("plan_id") REFERENCES "public"."plan"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "public"."city" ADD CONSTRAINT "FK_37ecd8addf395545dcb0242a593" FOREIGN KEY ("state_id") REFERENCES "public"."state"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."city" DROP CONSTRAINT "FK_37ecd8addf395545dcb0242a593"`);
        await queryRunner.query(`ALTER TABLE "public"."tenant" DROP CONSTRAINT "FK_ec1ebacb05d922fc744567258e6"`);
        await queryRunner.query(`ALTER TABLE "public"."tenant" DROP CONSTRAINT "FK_02cc2270193a6410fe159e2e126"`);
        await queryRunner.query(`ALTER TABLE "public"."opening_hour" DROP CONSTRAINT "FK_0dcd4e24f4098dd694b329fbecd"`);
        await queryRunner.query(`ALTER TABLE "public"."opening_hour" DROP CONSTRAINT "FK_ba82714f12f7a13769cde630863"`);
        await queryRunner.query(`ALTER TABLE "public"."delivery" DROP CONSTRAINT "FK_fab087f3d65c8aa342ef628a456"`);
        await queryRunner.query(`ALTER TABLE "public"."banner" DROP CONSTRAINT "FK_515dc8f2c16fa70dc07f02ab565"`);
        await queryRunner.query(`DROP TABLE "public"."weekday"`);
        await queryRunner.query(`DROP TABLE "public"."city"`);
        await queryRunner.query(`DROP INDEX "public"."UQ_tenant_email_active"`);
        await queryRunner.query(`DROP INDEX "public"."UQ_tenant_slug_active"`);
        await queryRunner.query(`DROP TABLE "public"."tenant"`);
        await queryRunner.query(`DROP TABLE "public"."plan"`);
        await queryRunner.query(`DROP TABLE "public"."opening_hour"`);
        await queryRunner.query(`DROP TABLE "public"."delivery"`);
        await queryRunner.query(`DROP TABLE "public"."banner"`);
        await queryRunner.query(`DROP TABLE "public"."state"`);
    }

}
