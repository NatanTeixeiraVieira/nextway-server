import { ErrorMessages } from '@/shared/application/error-messages/error-messages';
import { InvalidEmailCodeError } from '@/shared/application/errors/invalid-email-code-error';
import { NotFoundError } from '@/shared/application/errors/not-found-error';
import { UseCase } from '@/shared/application/usecases/use-case';
import { TenantRepository } from '../../domain/repositories/tenant.repository';
import { TenantOutput, TenantOutputMapper } from '../outputs/tenant-output';

export type Input = {
	email: string;
	verifyEmailCode: string;
};

export type Output = TenantOutput;

export class CheckTenantEmailUseCase implements UseCase<Input, Output> {
	constructor(
		private readonly tenantRepository: TenantRepository,
		private readonly tenantOutputMapper: TenantOutputMapper,
	) {}

	async execute(input: Input): Promise<TenantOutput> {
		const tenant = await this.tenantRepository.getByEmail(input.email);

		if (!tenant) {
			throw new NotFoundError(ErrorMessages.tenantNotFoundByEmail(input.email));
		}

		if (tenant.verifyEmailCode !== input.verifyEmailCode) {
			throw new InvalidEmailCodeError(ErrorMessages.INVALID_CHECK_EMAIL_CODE);
		}

		tenant.checkEmail();
		await this.tenantRepository.update(tenant);
		return this.tenantOutputMapper.toOutput(tenant);
	}
}
