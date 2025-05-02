import { UserQuery } from '@/core/user/application/queries/user.query';
import { Repository } from 'typeorm';
import { UserSchema } from '../schemas/user.schema';

export class UserTypeOrmQuery implements UserQuery {
	constructor(private readonly userQuery: Repository<UserSchema>) {}

	async existsActiveById(id: string): Promise<boolean> {
		return await this.userQuery.existsBy({ id, active: true });
	}

	async emailAccountActiveExists(email: string): Promise<boolean> {
		return await this.userQuery.existsBy({ email, active: true });
	}
}
