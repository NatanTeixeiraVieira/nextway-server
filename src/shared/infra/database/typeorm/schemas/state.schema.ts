import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CitySchema } from './city.schema';

@Entity('state')
export class StateSchema {
	@PrimaryGeneratedColumn('increment')
	id: string;

	@Column({ name: 'name', type: 'varchar', length: 20, nullable: false })
	name: string;

	@Column({ name: 'uf', type: 'varchar', length: 2, nullable: false })
	uf: string;

	@OneToMany(
		() => CitySchema,
		(city) => city.state,
	)
	cities: CitySchema[];
}
