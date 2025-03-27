import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { TenantSchema } from './tenant.schema';

@Entity('plan')
export class PlanSchema {
	@PrimaryColumn('uuid')
	id: string;

	@Column({ type: 'varchar', length: 30, nullable: false })
	name: string;

	@Column({ type: 'decimal', precision: 6, scale: 2, nullable: false })
	price: string;

	@OneToMany(
		() => TenantSchema,
		(tenant) => tenant.plan,
	)
	tenants: TenantSchema[];
}
