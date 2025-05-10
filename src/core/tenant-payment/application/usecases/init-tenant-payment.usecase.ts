import { Transactional } from '@/shared/application/database/decorators/transactional.decorator';
import { ErrorMessages } from '@/shared/application/error-messages/error-messages';
import { BadRequestError } from '@/shared/application/errors/bad-request-error';
import { PlanQuery } from '@/shared/application/queries/plan.query';
import { CardService } from '@/shared/application/services/card.service';
import { LoggedTenantService } from '@/shared/application/services/logged-tenant.service';
import { PlanPaymentService } from '@/shared/application/services/plan-payment.service';
import { UseCase } from '@/shared/application/usecases/use-case';
import { TenantPayment } from '../../domain/entities/tenant-payment.entity';
import { TenantPaymentRepository } from '../../domain/repositories/tenant-payment.repository';
import {
	TenantPaymentOutput,
	TenantPaymentOutputMapper,
} from '../outputs/tenant-payment-output';

export type Input = {
	cardToken: string;
	cardLastDigits: string;
	cardBrand: string;

	payerEmail: string;
	payerName: string;
	payerDocument: string;
};

export type Output = TenantPaymentOutput;

export class InitTenantPaymentUseCase implements UseCase<Input, Output> {
	constructor(
		private readonly planPaymentService: PlanPaymentService,
		private readonly cardService: CardService,
		private readonly planQuery: PlanQuery,
		private readonly tenantPaymentRepository: TenantPaymentRepository,
		private readonly loggedTenantService: LoggedTenantService,
		private readonly tenantPaymentOutputMapper: TenantPaymentOutputMapper,
	) {}

	@Transactional()
	async execute(input: Input): Promise<TenantPaymentOutput> {
		const cardBrand = this.cardService.mapCardBand(input.cardBrand);
		const plan = await this.planQuery.getPlan();
		const loggedTenant = this.loggedTenantService.getLoggedTenant();

		if (!loggedTenant) {
			throw new BadRequestError(ErrorMessages.TENANT_NOT_FOUND);
		}

		await this.createSignature(
			input.cardToken,
			plan.externalId,
			input.payerEmail,
			loggedTenant.id,
		);

		const tenantPayment = TenantPayment.initPayment({
			cardBrand,
			cardLastDigits: input.cardLastDigits,
			cardToken: input.cardToken,
			currency: 'BRL',
			price: plan.price,
			tenantId: loggedTenant.id,
		});

		await this.tenantPaymentRepository.create(tenantPayment);

		return this.tenantPaymentOutputMapper.toOutput(tenantPayment);
	}

	private async createSignature(
		cardToken: string,
		externalPlanId: string,
		payerEmail: string,
		loggedTenantId: string,
	): Promise<void> {
		await this.planPaymentService.createSignature({
			cardToken,
			externalPlanId,
			payerEmail,
			payerId: loggedTenantId,
		});
	}
}
