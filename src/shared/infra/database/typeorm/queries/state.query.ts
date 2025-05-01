import { StateQuery } from '@/shared/application/queries/state.query';
import { StateProps } from '@/shared/domain/entities/state.entity';
import { StateSchema } from '@/shared/infra/database/typeorm/schemas/state.schema';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class StateTypeOrmQuery implements StateQuery {
	constructor(
		@InjectRepository(StateSchema)
		private readonly stateQuery: Repository<StateSchema>,
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
}
