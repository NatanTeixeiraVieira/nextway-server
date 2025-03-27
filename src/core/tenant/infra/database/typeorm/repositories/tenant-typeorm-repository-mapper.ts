import { Tenant } from '@/core/tenant/domain/entities/tenant.entity';
import { RepositoryEntityMapper } from '@/shared/domain/repositories/repository-entity-mapper';
import { RepositorySchemaMapper } from '@/shared/domain/repositories/repository-schema-mapper';
import { TenantSchema } from '../schemas/tenant.schema';

export class TenantTypeormRepositoryMapper
	implements
		RepositoryEntityMapper<TenantSchema, Tenant>,
		RepositorySchemaMapper<TenantSchema, Tenant>
{
	toEntity(schema: TenantSchema): Tenant {
		return Tenant.with({
			id: schema.id,
			email: schema.email,
			password: schema.password,
			audit: {
				createdAt: schema.createdAt,
				updatedAt: schema.updatedAt,
				deletedAt: schema.deletedAt,
			},
			active: schema.active,
			emailVerified: schema.emailVerified,
			forgotPasswordEmailVerificationToken:
				schema.forgotPasswordEmailVerificationToken,
		});
	}

	toSchema(entity: Tenant): TenantSchema {
		return {
			id: entity.id,
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
