import { BaseProps, Entity } from '@/shared/domain/entities/entity';

export abstract class OutputMapper<
	E extends Entity<BaseProps>,
	Output extends object,
> {
	toOutput(entity: E): Output {
		return entity.toJSON() as Output;
	}
}
