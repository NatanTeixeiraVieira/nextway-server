import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeColumnsNameToSnakeCase1746119831665 implements MigrationInterface {
    name = 'ChangeColumnsNameToSnakeCase1746119831665'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "banner" RENAME COLUMN "imagePath" TO "image_path"`);
        await queryRunner.query(`ALTER TABLE "weekday" RENAME COLUMN "shortName" TO "short_name"`);
        await queryRunner.query(`ALTER TABLE "delivery" DROP COLUMN "deliveryRadiusKm"`);
        await queryRunner.query(`ALTER TABLE "delivery" DROP COLUMN "deliveryPrice"`);
        await queryRunner.query(`ALTER TABLE "tenant" DROP COLUMN "responsibleName"`);
        await queryRunner.query(`ALTER TABLE "tenant" DROP COLUMN "responsibleCpf"`);
        await queryRunner.query(`ALTER TABLE "tenant" DROP COLUMN "responsiblePhoneNumber"`);
        await queryRunner.query(`ALTER TABLE "tenant" DROP COLUMN "streetNumber"`);
        await queryRunner.query(`ALTER TABLE "tenant" DROP COLUMN "corporateReason"`);
        await queryRunner.query(`ALTER TABLE "tenant" DROP COLUMN "establishmentName"`);
        await queryRunner.query(`ALTER TABLE "tenant" DROP COLUMN "establishmentPhoneNumber"`);
        await queryRunner.query(`ALTER TABLE "tenant" DROP COLUMN "mainColor"`);
        await queryRunner.query(`ALTER TABLE "tenant" DROP COLUMN "coverImagePath"`);
        await queryRunner.query(`ALTER TABLE "tenant" DROP COLUMN "logoImagePath"`);
        await queryRunner.query(`ALTER TABLE "tenant" DROP COLUMN "emailVerified"`);
        await queryRunner.query(`ALTER TABLE "tenant" DROP COLUMN "verifyEmailCode"`);
        await queryRunner.query(`ALTER TABLE "tenant" DROP COLUMN "forgotPasswordEmailVerificationToken"`);
        await queryRunner.query(`ALTER TABLE "tenant" DROP COLUMN "payerName"`);
        await queryRunner.query(`ALTER TABLE "tenant" DROP COLUMN "payerDocument"`);
        await queryRunner.query(`ALTER TABLE "tenant" DROP COLUMN "payerEmail"`);
        await queryRunner.query(`ALTER TABLE "delivery" ADD "delivery_radius_km" numeric(4,1) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "delivery" ADD "delivery_price" numeric(9,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tenant" ADD "responsible_name" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tenant" ADD "responsible_cpf" character varying(11) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tenant" ADD "responsible_phone_number" character varying(13) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tenant" ADD "street_number" character varying(10) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tenant" ADD "corporate_reason" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tenant" ADD "establishment_name" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tenant" ADD "establishment_phone_number" character varying(13)`);
        await queryRunner.query(`ALTER TABLE "tenant" ADD "main_color" character varying(7) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tenant" ADD "cover_image_path" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "tenant" ADD "logo_image_path" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "tenant" ADD "email_verified" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "tenant" ADD "verify_email_code" character varying(6)`);
        await queryRunner.query(`ALTER TABLE "tenant" ADD "forgot_password_email_verification_token" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "tenant" ADD "payer_name" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "tenant" ADD "payer_document" character varying(14)`);
        await queryRunner.query(`ALTER TABLE "tenant" ADD "payer_email" character varying(255)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tenant" DROP COLUMN "payer_email"`);
        await queryRunner.query(`ALTER TABLE "tenant" DROP COLUMN "payer_document"`);
        await queryRunner.query(`ALTER TABLE "tenant" DROP COLUMN "payer_name"`);
        await queryRunner.query(`ALTER TABLE "tenant" DROP COLUMN "forgot_password_email_verification_token"`);
        await queryRunner.query(`ALTER TABLE "tenant" DROP COLUMN "verify_email_code"`);
        await queryRunner.query(`ALTER TABLE "tenant" DROP COLUMN "email_verified"`);
        await queryRunner.query(`ALTER TABLE "tenant" DROP COLUMN "logo_image_path"`);
        await queryRunner.query(`ALTER TABLE "tenant" DROP COLUMN "cover_image_path"`);
        await queryRunner.query(`ALTER TABLE "tenant" DROP COLUMN "main_color"`);
        await queryRunner.query(`ALTER TABLE "tenant" DROP COLUMN "establishment_phone_number"`);
        await queryRunner.query(`ALTER TABLE "tenant" DROP COLUMN "establishment_name"`);
        await queryRunner.query(`ALTER TABLE "tenant" DROP COLUMN "corporate_reason"`);
        await queryRunner.query(`ALTER TABLE "tenant" DROP COLUMN "street_number"`);
        await queryRunner.query(`ALTER TABLE "tenant" DROP COLUMN "responsible_phone_number"`);
        await queryRunner.query(`ALTER TABLE "tenant" DROP COLUMN "responsible_cpf"`);
        await queryRunner.query(`ALTER TABLE "tenant" DROP COLUMN "responsible_name"`);
        await queryRunner.query(`ALTER TABLE "delivery" DROP COLUMN "delivery_price"`);
        await queryRunner.query(`ALTER TABLE "delivery" DROP COLUMN "delivery_radius_km"`);
        await queryRunner.query(`ALTER TABLE "tenant" ADD "payerEmail" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "tenant" ADD "payerDocument" character varying(14)`);
        await queryRunner.query(`ALTER TABLE "tenant" ADD "payerName" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "tenant" ADD "forgotPasswordEmailVerificationToken" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "tenant" ADD "verifyEmailCode" character varying(6)`);
        await queryRunner.query(`ALTER TABLE "tenant" ADD "emailVerified" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "tenant" ADD "logoImagePath" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "tenant" ADD "coverImagePath" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "tenant" ADD "mainColor" character varying(7) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tenant" ADD "establishmentPhoneNumber" character varying(13)`);
        await queryRunner.query(`ALTER TABLE "tenant" ADD "establishmentName" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tenant" ADD "corporateReason" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tenant" ADD "streetNumber" character varying(10) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tenant" ADD "responsiblePhoneNumber" character varying(13) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tenant" ADD "responsibleCpf" character varying(11) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tenant" ADD "responsibleName" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "delivery" ADD "deliveryPrice" numeric(9,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "delivery" ADD "deliveryRadiusKm" numeric(4,1) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "weekday" RENAME COLUMN "short_name" TO "shortName"`);
        await queryRunner.query(`ALTER TABLE "banner" RENAME COLUMN "image_path" TO "imagePath"`);
    }

}
