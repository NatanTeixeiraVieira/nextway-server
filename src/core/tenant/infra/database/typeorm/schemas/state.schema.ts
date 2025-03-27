import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { CitySchema } from './city.schema';

@Entity('state')
export class StateSchema {
	@PrimaryColumn('uuid')
	id: string;

	@Column({ type: 'varchar', length: 20, nullable: false })
	name: string;

	@Column({ type: 'varchar', length: 2, nullable: false })
	uf: string;

	@OneToMany(
		() => CitySchema,
		(city) => city.state,
	)
	cities: CitySchema[];
}
