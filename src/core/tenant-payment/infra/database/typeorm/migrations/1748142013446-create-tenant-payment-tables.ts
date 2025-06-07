import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTenantPaymentTables1748142013446 implements MigrationInterface {
    name = 'CreateTenantPaymentTables1748142013446'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."tenant-payment_status_enum" AS ENUM('PAID', 'PENDING', 'FAILED', 'CANCELED')`);
        await queryRunner.query(`CREATE TABLE "tenant-payment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "price" numeric(6,2) NOT NULL, "currency" character varying(3) NOT NULL, "status" "public"."tenant-payment_status_enum" NOT NULL, "next_due_date" TIMESTAMP, "tenant_id" uuid NOT NULL, CONSTRAINT "PK_0028db65973aa545a6401b6c352" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "tenant-payment"`);
        await queryRunner.query(`DROP TYPE "public"."tenant-payment_status_enum"`);
    }

}
