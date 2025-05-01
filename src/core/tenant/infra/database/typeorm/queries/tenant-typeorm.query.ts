import {
	GetInactiveUserIdByEmail,
	GetWeekdayById,
	TenantQuery,
} from '@/core/tenant/application/queries/tenant.query';
import { CityProps } from '@/core/tenant/domain/entities/city.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { CitySchema } from '../schemas/city.schema';
import { TenantSchema } from '../schemas/tenant.schema';
import { WeekdaySchema } from '../schemas/weekday.schema';

export class TenantTypeOrmQuery implements TenantQuery {
	constructor(
		@InjectRepository(TenantSchema)
		private readonly tenantQuery: Repository<TenantSchema>,
		@InjectRepository(WeekdaySchema)
		private readonly weekdayQuery: Repository<WeekdaySchema>,
		@InjectRepository(CitySchema)
		private readonly cityQuery: Repository<CitySchema>,
	) {}

	async getOneCityByName(name: string): Promise<CityProps | null> {
		const schema = await this.cityQuery.findOne({
			select: ['id', 'name'],
			where: { name },
		});

		if (!schema) return null;

		return {
			id: schema.id,
			name: schema.name,
		};
	}

	async isEmailVerified(email: string): Promise<boolean> {
		return await this.tenantQuery.existsBy({
			email,
			emailVerified: Not(IsNull()),
		});
	}

	async cnpjExists(cnpj: string): Promise<boolean> {
		return await this.tenantQuery.existsBy({ cnpj, active: true });
	}

	async slugExists(slug: string): Promise<boolean> {
		return await this.tenantQuery.existsBy({ slug, active: true });
	}

	async getWeekdayById(id: string): Promise<GetWeekdayById | null> {
		const weekday = await this.weekdayQuery.findOne({
			select: ['id', 'name', 'shortName'],
			where: { id },
		});

		if (!weekday) {
			return null;
		}

		return {
			id: weekday.id,
			weekdayName: weekday.name,
			weekdayShortName: weekday.shortName,
		};
	}

	async getInactiveUserIdByEmail(
		email: string,
	): Promise<GetInactiveUserIdByEmail | null> {
		const weekday = await this.tenantQuery.findOne({
			select: ['id'],
			where: { email, active: false },
		});

		if (!weekday) {
			return null;
		}

		return { id: weekday.id };
	}
}
