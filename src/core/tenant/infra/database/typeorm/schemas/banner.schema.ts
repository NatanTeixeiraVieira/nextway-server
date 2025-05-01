import { Schema } from '@/shared/infra/database/typeorm/schemas/schema';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { TenantSchema } from './tenant.schema';

@Entity('banner')
export class BannerSchema extends Schema {
	@Column({ name: 'image_path', type: 'varchar', length: 70, nullable: false })
	imagePath: string;

	@Column({ name: 'active', type: 'boolean', nullable: false })
	active: boolean;

	@ManyToOne(
		() => TenantSchema,
		(tenant) => tenant.banners,
	)
	@JoinColumn({ name: 'tenant_id' })
	tenant: TenantSchema;
}
