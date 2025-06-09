import { ErrorMessages } from '@/shared/application/error-messages/error-messages';
import { NotFoundError } from '@/shared/application/errors/not-found-error';
import { UseCase } from '@/shared/application/usecases/use-case';
import { TenantRepository } from '../../domain/repositories/tenant.repository';

export type Input = {
	nextDueDate: Date;
	tenantId: string;
};

export type Output = undefined;

export class handleFinishedPaymentUseCase implements UseCase<Input, Output> {
	constructor(private readonly tenantRepository: TenantRepository) {}

	async execute({ nextDueDate, tenantId }: Input): Promise<Output> {
		const tenant = await this.tenantRepository.getById(tenantId);

		if (!tenant) {
			throw new NotFoundError(ErrorMessages.tenantNotFoundById(tenantId));
		}

		const formattedNextDueDate = new Date(nextDueDate);

		tenant.activateAccount({ nextDueDate: formattedNextDueDate });

		await this.tenantRepository.update(tenant);
	}
}
