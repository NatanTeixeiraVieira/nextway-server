import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTenantTables1746142510565 implements MigrationInterface {
	name = 'CreateTenantTables1746142510565';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE "banner" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "image_path" character varying(70) NOT NULL, "active" boolean NOT NULL, "tenant_id" uuid, CONSTRAINT "PK_6d9e2570b3d85ba37b681cd4256" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TABLE "delivery" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "delivery_radius_km" numeric(4,1) NOT NULL, "delivery_price" numeric(9,2) NOT NULL, "tenant_id" uuid, CONSTRAINT "PK_ffad7bf84e68716cd9af89003b0" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TABLE "weekday" ("id" SERIAL NOT NULL, "name" character varying(7) NOT NULL, "short_name" character varying(4) NOT NULL, CONSTRAINT "PK_513bca9acbf0c2597a8c599c514" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TABLE "opening_hour" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "start" character varying(5) NOT NULL, "end" character varying(5) NOT NULL, "weekday_id" integer, "tenant_id" uuid, CONSTRAINT "PK_6551ceb95c04da8afd85da470c9" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TYPE "public"."tenant_payer_document_type_enum" AS ENUM('CPF', 'CNPJ')`,
		);
		await queryRunner.query(
			`CREATE TABLE "tenant" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "responsible_name" character varying(255) NOT NULL, "responsible_cpf" character varying(11) NOT NULL, "email" character varying(255) NOT NULL, "responsible_phone_number" character varying(13) NOT NULL, "zipcode" character varying(8) NOT NULL, "neighborhood" character varying(50) NOT NULL, "street" character varying(100) NOT NULL, "street_number" character varying(10) NOT NULL, "longitude" numeric(10,7) NOT NULL, "latitude" numeric(10,7) NOT NULL, "cnpj" character varying(14) NOT NULL, "corporate_reason" character varying(255) NOT NULL, "establishment_name" character varying(255) NOT NULL, "establishment_phone_number" character varying(13), "slug" character varying(255) NOT NULL, "password" character varying(100) NOT NULL, "main_color" character varying(7) NOT NULL, "cover_image_path" character varying(255), "logo_image_path" character varying(255), "description" text, "email_verified" TIMESTAMP, "verify_email_code" character varying(6), "forgot_password_email_verification_token" character varying(255), "active" boolean NOT NULL DEFAULT true, "payer_name" character varying(255), "payer_document" character varying(14), "payer_document_type" "public"."tenant_payer_document_type_enum", "payer_email" character varying(255), "city_id" integer, "plan_id" uuid, CONSTRAINT "UQ_5b5d9635409048b7144f5f23198" UNIQUE ("email"), CONSTRAINT "UQ_abfd243f7bd832e806d19c5a919" UNIQUE ("slug"), CONSTRAINT "PK_da8c6efd67bb301e810e56ac139" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE UNIQUE INDEX "UQ_tenant_slug_active" ON "tenant" ("slug") WHERE "deleted_at" IS NULL`,
		);
		await queryRunner.query(
			`CREATE UNIQUE INDEX "UQ_tenant_email_active" ON "tenant" ("email") WHERE "deleted_at" IS NULL`,
		);
		await queryRunner.query(
			`ALTER TABLE "banner" ADD CONSTRAINT "FK_515dc8f2c16fa70dc07f02ab565" FOREIGN KEY ("tenant_id") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "delivery" ADD CONSTRAINT "FK_fab087f3d65c8aa342ef628a456" FOREIGN KEY ("tenant_id") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "opening_hour" ADD CONSTRAINT "FK_ba82714f12f7a13769cde630863" FOREIGN KEY ("weekday_id") REFERENCES "weekday"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "opening_hour" ADD CONSTRAINT "FK_0dcd4e24f4098dd694b329fbecd" FOREIGN KEY ("tenant_id") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "tenant" ADD CONSTRAINT "FK_4525d4cd7c0370f7263f29a5d70" FOREIGN KEY ("city_id") REFERENCES "city"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "tenant" ADD CONSTRAINT "FK_ec1ebacb05d922fc744567258e6" FOREIGN KEY ("plan_id") REFERENCES "plan"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "tenant" DROP CONSTRAINT "FK_ec1ebacb05d922fc744567258e6"`,
		);
		await queryRunner.query(
			`ALTER TABLE "tenant" DROP CONSTRAINT "FK_4525d4cd7c0370f7263f29a5d70"`,
		);
		await queryRunner.query(
			`ALTER TABLE "opening_hour" DROP CONSTRAINT "FK_0dcd4e24f4098dd694b329fbecd"`,
		);
		await queryRunner.query(
			`ALTER TABLE "opening_hour" DROP CONSTRAINT "FK_ba82714f12f7a13769cde630863"`,
		);
		await queryRunner.query(
			`ALTER TABLE "delivery" DROP CONSTRAINT "FK_fab087f3d65c8aa342ef628a456"`,
		);
		await queryRunner.query(
			`ALTER TABLE "banner" DROP CONSTRAINT "FK_515dc8f2c16fa70dc07f02ab565"`,
		);
		await queryRunner.query(`DROP INDEX "public"."UQ_tenant_email_active"`);
		await queryRunner.query(`DROP INDEX "public"."UQ_tenant_slug_active"`);
		await queryRunner.query(`DROP TABLE "tenant"`);
		await queryRunner.query(
			`DROP TYPE "public"."tenant_payer_document_type_enum"`,
		);
		await queryRunner.query(`DROP TABLE "opening_hour"`);
		await queryRunner.query(`DROP TABLE "weekday"`);
		await queryRunner.query(`DROP TABLE "delivery"`);
		await queryRunner.query(`DROP TABLE "banner"`);
	}
}
