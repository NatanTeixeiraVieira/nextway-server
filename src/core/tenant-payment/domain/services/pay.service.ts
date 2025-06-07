import {
	FinishPaymentProps,
	TenantPayment,
} from '../entities/tenant-payment.entity';

type TenantPaymentPayProps = Omit<FinishPaymentProps, 'nextDueDate'>;

export class PayService {
	execute(
		previousTenantPayment: TenantPayment | null,
		currentTenantPayment: TenantPayment,
		tenantPaymentPayProps: TenantPaymentPayProps,
	): void {
		const { status } = tenantPaymentPayProps;

		const baseDate = this.calculateBaseDate(
			previousTenantPayment?.nextDueDate ?? null,
			previousTenantPayment?.audit.createdAt ?? null,
		);

		const finishPaymentProps: FinishPaymentProps = {
			status,
			nextDueDate: this.calculateNextDueDate(baseDate),
		};

		currentTenantPayment.finishPayment(finishPaymentProps);
	}

	private calculateBaseDate(
		previousNextDueDate: Date | null,
		previousPaymentDate: Date | null,
	): Date {
		const currentDate = new Date();

		if (!previousNextDueDate || previousNextDueDate < currentDate) {
			return currentDate;
		}

		return previousPaymentDate ?? currentDate;
	}

	private calculateNextDueDate(previousPaymentDate: Date): Date {
		const nextDueDate = new Date(previousPaymentDate);
		const previousDueDateMonth = nextDueDate.getMonth();
		nextDueDate.setMonth(nextDueDate.getMonth() + 1); // Add one month

		this.adjustToValidDate(nextDueDate, previousDueDateMonth);

		return nextDueDate;
	}

	private adjustToValidDate(date: Date, previousDueDateMonth: number) {
		if (date.getMonth() > previousDueDateMonth + 1) {
			// Set to the last day of previous month
			date.setDate(0);
		}
	}
}
