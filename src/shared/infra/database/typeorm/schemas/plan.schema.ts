import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('plan')
export class PlanSchema {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ name: 'name', type: 'varchar', length: 30, nullable: false })
	name: string;

	@Column({
		name: 'external_id',
		type: 'varchar',
		length: 255,
		nullable: false,
	})
	externalId: string;

	@Column({
		name: 'price',
		type: 'decimal',
		precision: 6,
		scale: 2,
		nullable: false,
		transformer: {
			to: (value: number) => value,
			from: (value: string) => Number.parseFloat(value),
		},
	})
	price: number;
}
