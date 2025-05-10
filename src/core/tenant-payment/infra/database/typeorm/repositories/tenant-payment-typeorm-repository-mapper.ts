import {
	TenantPayment,
	TenantPaymentProps,
} from '@/core/tenant-payment/domain/entities/tenant-payment.entity';
import { RepositoryMapper } from '@/shared/domain/repositories/repository-mapper';
import { TenantPaymentSchema } from '../schemas/tenant-payment.schema';

export class TenantPaymentTypeormRepositoryMapper
	implements RepositoryMapper<TenantPaymentSchema, TenantPayment>
{
	toEntity(schema: TenantPaymentSchema): TenantPayment {
		return TenantPayment.with({
			id: schema.id,
			card: {
				active: schema.card.active,
				brand: schema.card.brand,
				lastDigits: schema.card.lastDigits,
				tenantId: schema.card.tenantId,
				token: schema.card.token,
			},
			currency: schema.currency,
			nextDueDate: schema.nextDueDate,
			price: schema.price,
			status: schema.status as TenantPaymentProps['status'],
			tenantId: schema.tenantId,
			audit: {
				createdAt: schema.createdAt,
				updatedAt: schema.updatedAt,
				deletedAt: schema.deletedAt,
			},
		});
	}

	toSchema(entity: TenantPayment): TenantPaymentSchema {
		return TenantPaymentSchema.with({
			id: entity.id,
			card: {
				active: entity.card.active,
				brand: entity.card.brand,
				lastDigits: entity.card.lastDigits,
				tenantId: entity.card.tenantId,
				token: entity.card.token,
			},
			currency: entity.currency,
			nextDueDate: entity.nextDueDate,
			price: entity.price,
			status: entity.status as TenantPaymentProps['status'],
			tenantId: entity.tenantId,
			createdAt: entity.audit.createdAt,
			updatedAt: entity.audit.updatedAt,
			deletedAt: entity.audit.deletedAt,
		});
	}
}
