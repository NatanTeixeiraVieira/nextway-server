import { User } from '@/core/user/domain/entities/user.entity';
import { RepositoryEntityMapper } from '@/shared/domain/repositories/repository-entity-mapper';
import { RepositorySchemaMapper } from '@/shared/domain/repositories/repository-schema-mapper';
import { UserSchema } from '../schemas/user.schema';

export class UserTypeormRepositoryMapper
	implements
		RepositoryEntityMapper<UserSchema, User>,
		RepositorySchemaMapper<UserSchema, User>
{
	toEntity(schema: UserSchema): User {
		return User.with({
			id: schema.id,
			name: schema.name,
			email: schema.email,
			password: schema.password,
			audit: {
				createdAt: schema.createdAt,
				updatedAt: schema.updatedAt,
				deletedAt: schema.deletedAt,
			},
			active: schema.active,
			emailVerified: schema.emailVerified,
			phoneNumber: schema.phoneNumber,
			forgotPasswordEmailVerificationToken:
				schema.forgotPasswordEmailVerificationToken,
		});
	}

	toSchema(entity: User): UserSchema {
		return {
			id: entity.id,
			name: entity.name,
			email: entity.email,
			password: entity.password,
			createdAt: entity.audit.createdAt,
			updatedAt: entity.audit.updatedAt,
			deletedAt: entity.audit.deletedAt,
			active: entity.active,
			emailVerified: entity.emailVerified,
			phoneNumber: entity.phoneNumber,
			forgotPasswordEmailVerificationToken:
				entity.forgotPasswordEmailVerificationToken,
		};
	}
}
