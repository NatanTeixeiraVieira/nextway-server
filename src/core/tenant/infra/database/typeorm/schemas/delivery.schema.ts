import { Schema } from '@/shared/infra/database/typeorm/schemas/schema';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { TenantSchema } from './tenant.schema';

@Entity('delivery')
export class DeliverySchema extends Schema {
	@Column({ type: 'decimal', precision: 4, scale: 1, nullable: false })
	deliveryRadiusKm: number;

	@Column({ type: 'decimal', precision: 9, scale: 2, nullable: false })
	deliveryPrice: number;

	@ManyToOne(
		() => TenantSchema,
		(tenant) => tenant.deliveries,
	)
	@JoinColumn()
	tenant: TenantSchema;
}
