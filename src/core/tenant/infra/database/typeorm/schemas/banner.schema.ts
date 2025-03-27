import { Schema } from '@/shared/infra/database/typeorm/schemas/schema';
import { Column, JoinColumn, ManyToOne } from 'typeorm';
import { TenantSchema } from './tenant.schema';

export class BannerSchema extends Schema {
	@Column({ type: 'varchar', length: 70, nullable: false })
	imagePath: string;

	@Column({ type: 'boolean', nullable: false })
	active: boolean;

	@ManyToOne(
		() => TenantSchema,
		(tenant) => tenant.banners,
	)
	@JoinColumn()
	tenant: TenantSchema;
}
