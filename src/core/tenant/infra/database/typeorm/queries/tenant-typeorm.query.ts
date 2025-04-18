import {
	GetWeekdayById,
	TenantQuery,
} from '@/core/tenant/application/queries/tenant.query';
import { CityProps } from '@/core/tenant/domain/entities/city.entity';
import { PlanProps } from '@/core/tenant/domain/entities/plan.entity';
import { StateProps } from '@/core/tenant/domain/entities/state.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CitySchema } from '../schemas/city.schema';
import { StateSchema } from '../schemas/state.schema';
import { TenantSchema } from '../schemas/tenant.schema';
import { WeekdaySchema } from '../schemas/weekday.schema';

export class TenantTypeOrmQuery implements TenantQuery {
	constructor(
		@InjectRepository(TenantSchema)
		private readonly tenantQuery: Repository<TenantSchema>,
		@InjectRepository(WeekdaySchema)
		private readonly weekdayQuery: Repository<WeekdaySchema>,
		@InjectRepository(StateSchema)
		private readonly stateQuery: Repository<StateSchema>,
		@InjectRepository(CitySchema)
		private readonly cityQuery: Repository<CitySchema>,
	) {}

	async getOneStateByName(name: string): Promise<StateProps | null> {
		const schema = await this.stateQuery.findOne({
			select: ['id', 'name', 'uf'],
			where: { name },
		});

		if (!schema) return null;

		return {
			id: schema.id,
			name: schema.name,
			uf: schema.uf,
		};
	}

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

	async emailExists(email: string): Promise<boolean> {
		return await this.tenantQuery.existsBy({ email, active: true });
	}

	async cnpjExists(cnpj: string): Promise<boolean> {
		return await this.tenantQuery.existsBy({ cnpj, active: true });
	}

	async slugExists(slug: string): Promise<boolean> {
		return await this.tenantQuery.existsBy({ slug, active: true });
	}

	async getPlan(): Promise<PlanProps & { id: string }> {
		return await this.tenantQuery.find()[0];
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
}
