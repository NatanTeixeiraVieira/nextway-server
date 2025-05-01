import { Schema } from '@/shared/infra/database/typeorm/schemas/schema';
import {
	Column,
	Entity,
	Index,
	JoinColumn,
	ManyToOne,
	OneToMany,
} from 'typeorm';
import { CitySchema } from '../../../../../../shared/infra/database/typeorm/schemas/city.schema';
import { PlanSchema } from '../../../../../../shared/infra/database/typeorm/schemas/plan.schema';
import { BannerSchema } from './banner.schema';
import { DeliverySchema } from './delivery.schema';
import { OpeningHourSchema } from './opening-hour.schema';

export type TenantSchemaProps = InstanceType<typeof TenantSchema>;

enum PayerDocumentType {
	CPF = 'CPF',
	CNPJ = 'CNPJ',
}

@Entity('tenant')
@Index('UQ_tenant_email_active', ['email'], {
	unique: true,
	where: '"deleted_at" IS NULL',
})
@Index('UQ_tenant_slug_active', ['slug'], {
	unique: true,
	where: '"deleted_at" IS NULL',
})
export class TenantSchema extends Schema {
	@Column({
		name: 'responsible_name',
		type: 'varchar',
		length: 255,
		nullable: false,
	})
	responsibleName: string;

	@Column({
		name: 'responsible_cpf',
		type: 'varchar',
		length: 11,
		nullable: false,
	})
	responsibleCpf: string;

	@Column({
		name: 'email',
		type: 'varchar',
		length: 255,
		unique: true,
		nullable: false,
	})
	email: string;

	@Column({
		name: 'responsible_phone_number',
		type: 'varchar',
		length: 13,
		nullable: false,
	})
	responsiblePhoneNumber: string;

	@Column({ name: 'zipcode', type: 'varchar', length: 8, nullable: false })
	zipcode: string;

	@Column({
		name: 'neighborhood',
		type: 'varchar',
		length: 50,
		nullable: false,
	})
	neighborhood: string;

	@Column({ name: 'street', type: 'varchar', length: 100, nullable: false })
	street: string;

	@Column({
		name: 'street_number',
		type: 'varchar',
		length: 10,
		nullable: false,
	})
	streetNumber: string;

	@Column({
		name: 'longitude',
		type: 'decimal',
		precision: 10,
		scale: 7,
		nullable: false,
		transformer: {
			to: (value: number) => value,
			from: (value: string) => Number.parseFloat(value),
		},
	})
	longitude: number;

	@Column({
		name: 'latitude',
		type: 'decimal',
		precision: 10,
		scale: 7,
		nullable: false,
		transformer: {
			to: (value: number) => value,
			from: (value: string) => Number.parseFloat(value),
		},
	})
	latitude: number;

	@Column({ name: 'cnpj', type: 'varchar', length: 14, nullable: false })
	cnpj: string;

	@Column({
		name: 'corporate_reason',
		type: 'varchar',
		length: 255,
		nullable: false,
	})
	corporateReason: string;

	@Column({
		name: 'establishment_name',
		type: 'varchar',
		length: 255,
		nullable: false,
	})
	establishmentName: string;

	@Column({
		name: 'establishment_phone_number',
		type: 'varchar',
		length: 13,
		nullable: true,
	})
	establishmentPhoneNumber: string;

	@Column({
		name: 'slug',
		type: 'varchar',
		length: 255,
		unique: true,
		nullable: false,
	})
	slug: string;

	@Column({ name: 'password', type: 'varchar', length: 100, nullable: false })
	password: string;

	@Column({ name: 'main_color', type: 'varchar', length: 7, nullable: false })
	mainColor: string;

	@Column({
		name: 'cover_image_path',
		type: 'varchar',
		length: 255,
		nullable: true,
	})
	coverImagePath: string | null;

	@Column({
		name: 'logo_image_path',
		type: 'varchar',
		length: 255,
		nullable: true,
	})
	logoImagePath: string | null;

	@Column({ name: 'description', type: 'text', nullable: true })
	description: string | null;

	@Column({ name: 'email_verified', type: 'timestamp', nullable: true })
	emailVerified: Date | null;

	@Column({
		name: 'verify_email_code',
		type: 'varchar',
		length: 6,
		nullable: true,
	})
	verifyEmailCode: string | null;

	@Column({
		name: 'forgot_password_email_verification_token',
		type: 'varchar',
		length: 255,
		nullable: true,
	})
	forgotPasswordEmailVerificationToken: string | null;

	@Column({ name: 'active', type: 'boolean', default: true })
	active: boolean;

	@Column({ name: 'payer_name', type: 'varchar', length: 255, nullable: true })
	payerName: string | null;

	@Column({
		name: 'payer_document',
		type: 'varchar',
		length: 14,
		nullable: true,
	})
	payerDocument: string | null;

	@Column({
		name: 'payer_document_type',
		type: 'enum',
		enum: PayerDocumentType,
		nullable: true,
	})
	payerDocumentType: PayerDocumentType | null;

	@Column({ name: 'payer_email', type: 'varchar', length: 255, nullable: true })
	payerEmail: string | null;

	@ManyToOne(
		() => CitySchema,
		// (tenant) => tenant.tenants,
	)
	@JoinColumn()
	city: CitySchema;

	@OneToMany(
		() => BannerSchema,
		(banner) => banner.tenant,
	)
	banners: BannerSchema[];

	@OneToMany(
		() => DeliverySchema,
		(delivery) => delivery.tenant,
	)
	deliveries: DeliverySchema[];

	@OneToMany(
		() => OpeningHourSchema,
		(openingHour) => openingHour.tenant,
	)
	openingHours: OpeningHourSchema[];

	@ManyToOne(
		() => PlanSchema,
		// (plan) => plan.tenants,
	)
	@JoinColumn({ name: 'plan_id' })
	plan: PlanSchema;
}
