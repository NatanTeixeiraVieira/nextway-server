import { Transactional } from '@/shared/application/database/decorators/transactional.decorator';
import { BadRequestError } from '@/shared/application/errors/bad-request-error';
import { MessagingService } from '@/shared/application/services/messaging.service';
import {
	PaymentInfos,
	PlanPaymentService,
} from '@/shared/application/services/plan-payment.service';
import { UseCase } from '@/shared/application/usecases/use-case';
import { DomainEvent } from '@/shared/domain/events/domain-event';
import { MessagingTopics } from '../../../../shared/application/constants/messaging';
import { TenantPayment } from '../../domain/entities/tenant-payment.entity';
import { TenantPaymentRepository } from '../../domain/repositories/tenant-payment.repository';

export type Input = {
	payerId: string;
	paymentInfos: PaymentInfos;
};

export type Output = undefined;

export class FinishTenantPaymentUseCase implements UseCase<Input, Output> {
	constructor(
		private readonly planPaymentService: PlanPaymentService,
		private readonly tenantPaymentRepository: TenantPaymentRepository,
		private readonly messagingService: MessagingService,
	) {}

	@Transactional()
	async execute({ payerId, paymentInfos }: Input): Promise<Output> {
		const isPaymentFinished =
			this.planPaymentService.isPaymentFinished(paymentInfos);

		if (!isPaymentFinished) return;

		const grantPaymentResponse =
			await this.planPaymentService.grantFinishedPayment({
				payerId,
			});

		if (!grantPaymentResponse) {
			console.log('Payment not found');
			throw new BadRequestError('Payment not found');
		}

		const tenantPayment = await this.createTenantPayment(
			grantPaymentResponse.applicationPayerId,
			grantPaymentResponse.nextPaymentDate,
		);

		const events = tenantPayment.pullDomainEvents();

		await this.handleDomainEvents(events);

		await this.tenantPaymentRepository.update(tenantPayment);
	}

	private async createTenantPayment(
		tenantId: string,
		nextDueDate: Date,
	): Promise<TenantPayment> {
		const currentPayment =
			await this.tenantPaymentRepository.getLastPendingPaymentByTenantId(
				tenantId,
			);

		if (!currentPayment) {
			throw new BadRequestError('No pending payment found');
		}

		currentPayment.finishPayment({ nextDueDate, status: 'PAID' });

		return currentPayment;
	}

	private async handleDomainEvents(events: DomainEvent[]): Promise<void> {
		await Promise.all(
			events.map((event) =>
				this.messagingService.publish(MessagingTopics.PAYMENT_FINISHED, event),
			),
		);
	}
}
