import {
	GetWeekdayById,
	TenantQuery,
} from '@/core/tenant/application/queries/tenant.query';
import { PlanProps } from '@/core/tenant/domain/entities/plan.entity';
import { Repository } from 'typeorm';
import { TenantSchema } from '../schemas/tenant.schema';
import { WeekdaySchema } from '../schemas/weekday.schema';

export class TenantTypeOrmQuery implements TenantQuery {
	constructor(
		private readonly tenantQuery: Repository<TenantSchema>,
		private readonly weekdayQuery: Repository<WeekdaySchema>,
	) {}

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
