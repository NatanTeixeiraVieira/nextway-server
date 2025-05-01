import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { StateSchema } from '../../../../../../shared/infra/database/typeorm/schemas/state.schema';
import { TenantSchema } from './tenant.schema';

@Entity('city')
export class CitySchema {
	@PrimaryGeneratedColumn('increment')
	id: string;

	@Column({ name: 'name', type: 'varchar', length: 40, nullable: false })
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
