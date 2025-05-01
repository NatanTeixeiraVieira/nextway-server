import { Repository } from '@/shared/domain/repositories/repository';
import { TenantPayment } from '../entities/tenant-payment.entity';

export interface TenantPaymentRepository extends Repository<TenantPayment> {}
