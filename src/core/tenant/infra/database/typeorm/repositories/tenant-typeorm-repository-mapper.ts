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
			state: {
				id: schema.city.state.id,
				name: schema.city.state.name,
				uf: schema.city.state.uf,
			},
			city: {
				id: schema.city.id,
				name: schema.city.name,
			},
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
				weekday: {
					id: weekday.id,
					name: weekday.name,
					shortName: weekday.shortName,
				},
			})),
			plan: {
				id: schema.plan.id,
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
		return TenantSchema.with({
			id: entity.id,
			responsibleName: entity.responsibleName,
			responsibleCpf: entity.responsibleCpf,
			email: entity.email,
			responsiblePhoneNumber: entity.responsiblePhoneNumber,
			zipcode: entity.zipcode,
			city: {
				id: entity.city.id,
				name: entity.city.name,
				state: {
					id: entity.state.id,
					name: entity.state.name,
					uf: entity.state.uf,
					cities: [],
				},
				tenants: [],
			},
			neighborhood: entity.neighborhood,
			street: entity.street,
			streetNumber: entity.streetNumber,
			longitude: entity.longitude,
			latitude: entity.latitude,
			cnpj: entity.cnpj,
			corporateReason: entity.corporateReason,
			establishmentName: entity.establishmentName,
			establishmentPhoneNumber: entity.establishmentPhoneNumber,
			slug: entity.slug,
			password: entity.password,
			mainColor: entity.mainColor,
			coverImagePath: entity.coverImagePath,
			logoImagePath: entity.logoImagePath,
			description: entity.description,
			banners: entity.banners.map((banner) => ({
				imagePath: banner.imagePath,
				active: banner.active,
			})),
			deliveries: entity.deliveries.map((delivery) => ({
				deliveryRadiusKm: delivery.deliveryRadiusKm,
				deliveryPrice: delivery.deliveryPrice,
			})),
			emailVerified: entity.emailVerified,
			verifyEmailCode: entity.verifyEmailCode,
			forgotPasswordEmailVerificationToken:
				entity.forgotPasswordEmailVerificationToken,
			active: entity.active,
			openingHours: entity.openingHours.map(({ end, start, weekday }) => ({
				start: start,
				end: end,
				weekday: {
					name: weekday.name,
					shortName: weekday.shortName,
				},
				tenant: null,
				createdAt: null,
			})),
			plan: {
				id: entity.plan.id,
				name: entity.plan.name,
				price: entity.plan.price,
				tenants: [],
			},
			createdAt: entity.audit.createdAt,
			updatedAt: entity.audit.updatedAt,
			deletedAt: entity.audit.deletedAt,
		});
	}
}
