import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTenantPaymentTables1746844668949
	implements MigrationInterface
{
	name = 'CreateTenantPaymentTables1746844668949';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE "tenant_card" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "token" character varying(255) NOT NULL, "last_digits" character varying(4) NOT NULL, "brand" character varying(30) NOT NULL, "active" boolean NOT NULL DEFAULT true, "tenant_id" uuid NOT NULL, CONSTRAINT "UQ_0eb3f9421883372ca948b2c374e" UNIQUE ("token"), CONSTRAINT "PK_d91739b0af3325c03f765cf4c25" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TYPE "public"."tenant-payment_status_enum" AS ENUM('PAID', 'PENDING', 'FAILED', 'CANCELED')`,
		);
		await queryRunner.query(
			`CREATE TABLE "tenant-payment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "price" numeric(6,2) NOT NULL, "currency" character varying(3) NOT NULL, "status" "public"."tenant-payment_status_enum" NOT NULL, "next_due_date" TIMESTAMP, "tenant_id" uuid NOT NULL, "card_id" uuid, CONSTRAINT "PK_0028db65973aa545a6401b6c352" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`ALTER TABLE "tenant-payment" ADD CONSTRAINT "FK_7dda252f8f4a39f2edd4c130968" FOREIGN KEY ("card_id") REFERENCES "tenant_card"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "tenant-payment" DROP CONSTRAINT "FK_7dda252f8f4a39f2edd4c130968"`,
		);
		await queryRunner.query(`DROP TABLE "tenant-payment"`);
		await queryRunner.query(`DROP TYPE "public"."tenant-payment_status_enum"`);
		await queryRunner.query(`DROP TABLE "tenant_card"`);
	}
}
