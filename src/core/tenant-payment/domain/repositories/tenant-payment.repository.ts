import {
	CreateRepository,
	GetByIdRepository,
	UpdateRepository,
} from '@/shared/domain/repositories/repository';
import { TenantPayment } from '../entities/tenant-payment.entity';

export interface TenantPaymentRepository
	extends GetByIdRepository<TenantPayment>,
		CreateRepository<TenantPayment>,
		UpdateRepository<TenantPayment> {
	getPreviousPaymentByTenantId(tenantId: string): Promise<TenantPayment | null>;
	getLastPendingPaymentByTenantId(
		tenantId: string,
	): Promise<TenantPayment | null>;
}
