import { BaseProps, Entity } from '../entities/entity';
import { RepositoryEntityMapper } from './repository-entity-mapper';
import { RepositorySchemaMapper } from './repository-schema-mapper';

export interface RepositoryMapper<Schema, E extends Entity<BaseProps>>
	extends RepositoryEntityMapper<Schema, E>,
		RepositorySchemaMapper<Schema, E> {}
