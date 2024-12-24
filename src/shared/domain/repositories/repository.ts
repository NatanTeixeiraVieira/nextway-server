import { BaseProps, Entity } from '../entities/entity';

export interface Repository<E extends Entity<BaseProps>> {
	findById(id: string): Promise<E | null>;
	create(entity: E): Promise<void>;
	update(entity: E): Promise<void>;
	delete(entity: E): Promise<void>;
}
