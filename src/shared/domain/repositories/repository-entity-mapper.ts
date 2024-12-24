import { BaseProps, Entity } from '../entities/entity';

export interface RepositoryEntityMapper<Schema, E extends Entity<BaseProps>> {
	toEntity(schema: Schema): E;
}
