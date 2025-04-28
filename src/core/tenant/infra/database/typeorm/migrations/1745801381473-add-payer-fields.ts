import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPayerFields1745801381473 implements MigrationInterface {
    name = 'AddPayerFields1745801381473'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tenant" ADD "payerName" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "tenant" ADD "payerDocument" character varying(14)`);
        await queryRunner.query(`CREATE TYPE "public"."tenant_payer_document_type_enum" AS ENUM('CPF', 'CNPJ')`);
        await queryRunner.query(`ALTER TABLE "tenant" ADD "payer_document_type" "public"."tenant_payer_document_type_enum"`);
        await queryRunner.query(`ALTER TABLE "tenant" ADD "payerEmail" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "tenant" DROP CONSTRAINT "UQ_7b94c14f79c0b1325b362afa902"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tenant" ADD CONSTRAINT "UQ_7b94c14f79c0b1325b362afa902" UNIQUE ("cnpj")`);
        await queryRunner.query(`ALTER TABLE "tenant" DROP COLUMN "payerEmail"`);
        await queryRunner.query(`ALTER TABLE "tenant" DROP COLUMN "payer_document_type"`);
        await queryRunner.query(`DROP TYPE "public"."tenant_payer_document_type_enum"`);
        await queryRunner.query(`ALTER TABLE "tenant" DROP COLUMN "payerDocument"`);
        await queryRunner.query(`ALTER TABLE "tenant" DROP COLUMN "payerName"`);
    }

}
