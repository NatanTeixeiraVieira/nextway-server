import { User } from '@/core/user/domain/entities/user.entity';
import { UserRepository } from '@/core/user/domain/repositories/user.repository';
import { Repository } from 'typeorm';
import { UserSchema } from '../schemas/user.schema';
import { UserTypeormRepositoryMapper } from './user-typeorm-repository-mapper';

export class UserTypeOrmRepository implements UserRepository {
	constructor(
		private readonly userRepository: Repository<UserSchema>,
		private readonly userRepositoryMapper: UserTypeormRepositoryMapper,
	) {}

	async findById(id: string): Promise<User | null> {
		const userSchema = await this.userRepository.findOneBy({ id });

		if (!userSchema) return null;

		return this.userRepositoryMapper.toEntity(userSchema);
	}

	async create(entity: User): Promise<void> {
		const userSchema = this.userRepositoryMapper.toSchema(entity);
		await this.userRepository.insert(userSchema);
	}

	async update(entity: User): Promise<void> {
		const userSchema = this.userRepositoryMapper.toSchema(entity);
		await this.userRepository.save(userSchema);
	}

	async delete(entity: User): Promise<void> {
		entity.deleteAccount();
		const userSchema = this.userRepositoryMapper.toSchema(entity);
		await this.userRepository.save(userSchema);
	}
}
