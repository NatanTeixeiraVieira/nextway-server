import { PlanQuery } from '@/shared/application/queries/plan.query';
import { PlanProps } from '@/shared/domain/entities/plan.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlanSchema } from '../schemas/plan.schema';

export class PlanTypeOrmQuery implements PlanQuery {
	constructor(
		@InjectRepository(PlanSchema)
		private readonly planQuery: Repository<PlanSchema>,
	) {}

	async getPlan(): Promise<PlanProps & { id: string }> {
		const plans = await this.planQuery.find();
		return plans[0];
	}
}
