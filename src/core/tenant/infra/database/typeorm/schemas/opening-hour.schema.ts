import { Schema } from '@/shared/infra/database/typeorm/schemas/schema';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { TenantSchema } from './tenant.schema';
import { WeekdaySchema } from './weekday.schema';

@Entity('opening_hour')
export class OpeningHourSchema extends Schema {
	@Column({ type: 'varchar', length: 5, nullable: false })
	start: string;

	@Column({ type: 'varchar', length: 5, nullable: false })
	end: string;

	@ManyToOne(
		() => WeekdaySchema,
		(weekday) => weekday.openingHours,
	)
	@JoinColumn()
	weekday: WeekdaySchema;

	@ManyToOne(
		() => TenantSchema,
		(tenant) => tenant.openingHours,
	)
	@JoinColumn()
	tenant: TenantSchema;
}
