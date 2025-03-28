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
			responsibleName: schema.responsibleName,
			responsibleCpf: schema.responsibleCpf,
			email: schema.email,
			responsiblePhoneNumber: schema.responsiblePhoneNumber,
			zipcode: schema.zipcode,
			state: schema.city.state.name,
			uf: schema.city.state.uf,
			city: schema.city.name,
			neighborhood: schema.neighborhood,
			street: schema.street,
			streetNumber: schema.streetNumber,
			longitude: schema.longitude,
			latitude: schema.latitude,
			cnpj: schema.cnpj,
			corporateReason: schema.corporateReason,
			establishmentName: schema.establishmentName,
			establishmentPhoneNumber: schema.establishmentPhoneNumber,
			slug: schema.slug,
			password: schema.password,
			mainColor: schema.mainColor,
			coverImagePath: schema.coverImagePath,
			logoImagePath: schema.logoImagePath,
			description: schema.description,
			banners: schema.banners.map(({ imagePath, active }) => ({
				imagePath,
				active,
			})),
			deliveries: schema.deliveries.map(
				({ deliveryRadiusKm, deliveryPrice }) => ({
					deliveryRadiusKm,
					deliveryPrice,
				}),
			),
			emailVerified: schema.emailVerified,
			verifyEmailCode: schema.verifyEmailCode,
			forgotPasswordEmailVerificationToken:
				schema.forgotPasswordEmailVerificationToken,
			active: schema.active,
			openingHours: schema.openingHours.map(({ start, end, weekday }) => ({
				start,
				end,
				weekdayName: weekday.name,
				weekdayShortName: weekday.shortName,
			})),
			plan: {
				name: schema.plan.name,
				price: schema.plan.price,
			},
			audit: {
				createdAt: schema.createdAt,
				updatedAt: schema.updatedAt,
				deletedAt: schema.deletedAt,
			},
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
