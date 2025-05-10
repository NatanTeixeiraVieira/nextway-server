import { BaseProps, Entity } from '../entities/entity';

export interface Repository<E extends Entity<BaseProps>>
	extends GetByIdRepository<E>,
		CreateRepository<E>,
		UpdateRepository<E>,
		DeleteRepository<E> {}

export interface GetByIdRepository<E extends Entity<BaseProps>> {
	getById(id: string): Promise<E | null>;
}

export interface CreateRepository<E extends Entity<BaseProps>> {
	create(entity: E): Promise<void>;
}

export interface UpdateRepository<E extends Entity<BaseProps>> {
	update(entity: E): Promise<void>;
}

export interface DeleteRepository<E extends Entity<BaseProps>> {
	delete(entity: E): Promise<void>;
}
