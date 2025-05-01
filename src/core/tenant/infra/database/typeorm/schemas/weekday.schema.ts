import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { OpeningHourSchema } from './opening-hour.schema';

@Entity('weekday')
export class WeekdaySchema {
	@PrimaryGeneratedColumn('increment')
	id: string;

	@Column({ name: 'name', type: 'varchar', length: 7, nullable: false })
	name: string;

	@Column({ name: 'short_name', type: 'varchar', length: 4, nullable: false })
	shortName: string;

	@OneToMany(
		() => OpeningHourSchema,
		(openingHour) => openingHour.weekday,
	)
	openingHours: OpeningHourSchema[];
}
