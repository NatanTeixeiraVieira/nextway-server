import { CityQuery } from '@/shared/application/queries/city.query';
import { CityProps } from '@/shared/domain/entities/city.entity';
import { CitySchema } from '@/shared/infra/database/typeorm/schemas/city.schema';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class CityTypeOrmQuery implements CityQuery {
	constructor(
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
}
