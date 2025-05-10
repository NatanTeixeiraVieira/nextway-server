import { UserCookiesName } from '@/core/user/application/constants/cookies';
import { ErrorMessages } from '@/shared/application/error-messages/error-messages';
import { InvalidEmailCodeError } from '@/shared/application/errors/invalid-email-code-error';
import { NotFoundError } from '@/shared/application/errors/not-found-error';
import { AuthService } from '@/shared/application/services/auth.service';
import { SetCookies } from '@/shared/application/types/cookies';
import { UseCase } from '@/shared/application/usecases/use-case';
import { TenantCookiesName } from '../../../../shared/application/constants/cookies';
import { Tenant } from '../../domain/entities/tenant.entity';
import { TenantRepository } from '../../domain/repositories/tenant.repository';
import { TenantOutput, TenantOutputMapper } from '../outputs/tenant-output';

export type Input = {
	email: string;
	verifyEmailCode: string;
	setCookies: SetCookies;
};

export type Output = TenantOutput;

export class CheckTenantEmailUseCase implements UseCase<Input, Output> {
	constructor(
		private readonly tenantRepository: TenantRepository,
		private readonly tenantOutputMapper: TenantOutputMapper,
		private readonly authService: AuthService,
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

		await this.authenticateAndHandleTokens(tenant, input.setCookies);
		return this.tenantOutputMapper.toOutput(tenant);
	}

	private async authenticateAndHandleTokens(
		tenant: Tenant,
		setCookies: SetCookies,
	): Promise<void> {
		const { accessToken, refreshToken } =
			await this.authService.authenticate(tenant);

		this.authService.setTokensInCookies({
			accessToken,
			refreshToken,
			accessTokenName: TenantCookiesName.ACCESS_TOKEN,
			refreshTokenName: TenantCookiesName.REFRESH_TOKEN,
			setCookies,
			accessTokenPath: UserCookiesName.ACCESS_TOKEN_PATH,
			refreshTokenPath: TenantCookiesName.REFRESH_TOKEN_PATH,
		});
	}
}
