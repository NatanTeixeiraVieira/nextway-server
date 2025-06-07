import { Transactional } from '@/shared/application/database/decorators/transactional.decorator';
import { ErrorMessages } from '@/shared/application/error-messages/error-messages';
import { BadRequestError } from '@/shared/application/errors/bad-request-error';
import { PlanQuery } from '@/shared/application/queries/plan.query';
import { LoggedTenantService } from '@/shared/application/services/logged-tenant.service';
import {
	CreateSignatureResponse,
	PlanPaymentService,
} from '@/shared/application/services/plan-payment.service';
import { UseCase } from '@/shared/application/usecases/use-case';
import { TenantPayment } from '../../domain/entities/tenant-payment.entity';
import { TenantPaymentRepository } from '../../domain/repositories/tenant-payment.repository';
import { TenantPaymentOutputMapper } from '../outputs/tenant-payment-output';

export type Input = undefined;

export type Output = {
	initUrl: string;
};

export class InitTenantPaymentUseCase implements UseCase<Input, Output> {
	constructor(
		private readonly planPaymentService: PlanPaymentService,
		private readonly planQuery: PlanQuery,
		private readonly tenantPaymentRepository: TenantPaymentRepository,
		private readonly loggedTenantService: LoggedTenantService,
		private readonly tenantPaymentOutputMapper: TenantPaymentOutputMapper,
	) {}

	@Transactional()
	async execute(): Promise<Output> {
		const plan = await this.planQuery.getPlan();
		const loggedTenant = this.loggedTenantService.getLoggedTenant();

		if (!loggedTenant) {
			throw new BadRequestError(ErrorMessages.TENANT_NOT_FOUND);
		}

		const { initUrl } = await this.createSignature(
			plan.price,
			loggedTenant.id,
			loggedTenant.email,
		);

		const tenantPayment = TenantPayment.initPayment({
			tenantId: loggedTenant.id,
			price: plan.price,
		});

		await this.tenantPaymentRepository.create(tenantPayment);

		return { initUrl };
	}

	private async createSignature(
		planPrice: number,
		loggedTenantId: string,
		loggedTenantEmail: string,
	): Promise<CreateSignatureResponse> {
		return await this.planPaymentService.createSignature({
			planPrice,
			payerId: loggedTenantId,
			payerEmail: loggedTenantEmail,
		});
	}

	// private async createTenantPayment(
	// 	planPrice: number,
	// 	loggedTenantId: string,
	// ): Promise<TenantPayment> {
	// 	const previousTenantPayment =
	// 		await this.tenantPaymentRepository.getPreviousPayment();

	// 	const payService = new PayService();
	// 	const tenantPayment = payService.execute(previousTenantPayment, {
	// 		price: planPrice,
	// 		status: 'PAID',
	// 		tenantId: loggedTenantId,
	// 	});

	// 	return tenantPayment;
	// }
}
