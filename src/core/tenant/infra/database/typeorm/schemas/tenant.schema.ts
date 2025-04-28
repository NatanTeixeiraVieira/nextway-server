import { Schema } from '@/shared/infra/database/typeorm/schemas/schema';
import {
	Column,
	Entity,
	Index,
	JoinColumn,
	ManyToOne,
	OneToMany,
} from 'typeorm';
import { BannerSchema } from './banner.schema';
import { CitySchema } from './city.schema';
import { DeliverySchema } from './delivery.schema';
import { OpeningHourSchema } from './opening-hour.schema';
import { PlanSchema } from './plan.schema';

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
	@Column({ type: 'varchar', length: 255, nullable: false })
	responsibleName: string;

	@Column({ type: 'varchar', length: 11, nullable: false })
	responsibleCpf: string;

	@Column({ type: 'varchar', length: 255, unique: true, nullable: false })
	email: string;

	@Column({ type: 'varchar', length: 13, nullable: false })
	responsiblePhoneNumber: string;

	@Column({ type: 'varchar', length: 8, nullable: false })
	zipcode: string;

	@Column({ type: 'varchar', length: 50, nullable: false })
	neighborhood: string;

	@Column({ type: 'varchar', length: 100, nullable: false })
	street: string;

	@Column({ type: 'varchar', length: 10, nullable: false })
	streetNumber: string;

	@Column({
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

	@Column({ type: 'varchar', length: 14, nullable: false })
	cnpj: string;

	@Column({ type: 'varchar', length: 255, nullable: false })
	corporateReason: string;

	@Column({ type: 'varchar', length: 255, nullable: false })
	establishmentName: string;

	@Column({ type: 'varchar', length: 13, nullable: true })
	establishmentPhoneNumber: string;

	@Column({ type: 'varchar', length: 255, unique: true, nullable: false })
	slug: string;

	@Column({ type: 'varchar', length: 100, nullable: false })
	password: string;

	@Column({ type: 'varchar', length: 7, nullable: false })
	mainColor: string;

	@Column({ type: 'varchar', length: 255, nullable: true })
	coverImagePath: string | null;

	@Column({ type: 'varchar', length: 255, nullable: true })
	logoImagePath: string | null;

	@Column({ type: 'text', nullable: true })
	description: string | null;

	@Column({ type: 'timestamp', nullable: true })
	emailVerified: Date | null;

	@Column({ type: 'varchar', length: 6, nullable: true })
	verifyEmailCode: string | null;

	@Column({ type: 'varchar', length: 255, nullable: true })
	forgotPasswordEmailVerificationToken: string | null;

	@Column({ type: 'boolean', default: true })
	active: boolean;

	@Column({ type: 'varchar', length: 255, nullable: true })
	payerName: string | null;

	@Column({ type: 'varchar', length: 14, nullable: true })
	payerDocument: string | null;

	@Column({
		name: 'payer_document_type',
		type: 'enum',
		enum: PayerDocumentType,
		nullable: true,
	})
	payerDocumentType: PayerDocumentType | null;

	@Column({ type: 'varchar', length: 255, nullable: true })
	payerEmail: string | null;

	@ManyToOne(
		() => CitySchema,
		(tenant) => tenant.tenants,
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
		(plan) => plan.tenants,
	)
	@JoinColumn({ name: 'plan_id' })
	plan: PlanSchema;
}
