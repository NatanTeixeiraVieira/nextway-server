import { BaseProps, Entity } from '../entities/entity';

export interface Repository<E extends Entity<BaseProps>> {
	create(entity: E): Promise<void>;
	findById(id: string): Promise<E>;
	update(entity: E): Promise<void>;
	delete(entity: E): Promise<void>;
}
