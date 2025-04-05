import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	PrimaryColumn,
} from 'typeorm';
import { StateSchema } from './state.schema';
import { TenantSchema } from './tenant.schema';

@Entity('city')
export class CitySchema {
	@PrimaryColumn('uuid')
	id: string;

	@Column({ type: 'varchar', length: 20, nullable: false })
	name: string;

	@ManyToOne(
		() => StateSchema,
		(state) => state.cities,
	)
	@JoinColumn()
	state: StateSchema;

	@OneToMany(
		() => TenantSchema,
		(tenant) => tenant.city,
	)
	tenants: TenantSchema[];
}
