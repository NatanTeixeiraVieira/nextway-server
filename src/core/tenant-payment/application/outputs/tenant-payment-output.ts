import { OutputMapper } from '@/shared/application/outputs/output-mapper';
import {
	TenantPayment,
	TenantPaymentStatus,
} from '../../domain/entities/tenant-payment.entity';
import { CardOutput } from './card-output';

export type TenantPaymentOutput = {
	id: string;
	tenantId: string;
	price: string;
	currency: string;
	card: CardOutput;
	status: TenantPaymentStatus;
	nextDueDate: Date;
};

export class TenantPaymentOutputMapper extends OutputMapper<
	TenantPayment,
	TenantPaymentOutput
> {}
