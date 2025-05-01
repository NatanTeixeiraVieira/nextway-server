import { Schema } from '@/shared/infra/database/typeorm/schemas/schema';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { TenantSchema } from './tenant.schema';

@Entity('delivery')
export class DeliverySchema extends Schema {
	@Column({
		name: 'delivery_radius_km',
		type: 'decimal',
		precision: 4,
		scale: 1,
		nullable: false,
	})
	deliveryRadiusKm: number;

	@Column({
		name: 'delivery_price',
		type: 'decimal',
		precision: 9,
		scale: 2,
		nullable: false,
	})
	deliveryPrice: number;

	@ManyToOne(
		() => TenantSchema,
		(tenant) => tenant.deliveries,
	)
	@JoinColumn({ name: 'tenant_id' })
	tenant: TenantSchema;
}
