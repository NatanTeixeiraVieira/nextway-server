import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { StateSchema } from './state.schema';

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
}
