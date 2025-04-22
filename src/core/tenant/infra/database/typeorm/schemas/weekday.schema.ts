import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CitySchema } from './city.schema';
import { OpeningHourSchema } from './opening-hour.schema';

@Entity('weekday')
export class WeekdaySchema {
	@PrimaryGeneratedColumn('increment')
	id: string;

	@Column({ type: 'varchar', length: 7, nullable: false })
	name: string;

	@Column({ type: 'varchar', length: 4, nullable: false })
	shortName: string;

	@OneToMany(
		() => CitySchema,
		(city) => city.state,
	)
	cities: CitySchema[];

	@OneToMany(
		() => OpeningHourSchema,
		(openingHour) => openingHour.weekday,
	)
	openingHours: OpeningHourSchema[];
}
