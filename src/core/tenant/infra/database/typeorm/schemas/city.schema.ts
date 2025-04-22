import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { StateSchema } from './state.schema';
import { TenantSchema } from './tenant.schema';

@Entity('city')
export class CitySchema {
	@PrimaryGeneratedColumn('increment')
	id: string;

	@Column({ type: 'varchar', length: 20, nullable: false })
	name: string;

	@ManyToOne(
		() => StateSchema,
		(state) => state.cities,
	)
	@JoinColumn({ name: 'state_id' })
	state: StateSchema;

	@OneToMany(
		() => TenantSchema,
		(tenant) => tenant.city,
	)
	tenants: TenantSchema[];
}
