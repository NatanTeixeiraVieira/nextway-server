import { EnvConfig } from '@/shared/application/env-config/env-config';
import { ErrorMessages } from '@/shared/application/error-messages/error-messages';
import { BadRequestError } from '@/shared/application/errors/bad-request-error';
import { JwtService } from '@/shared/application/services/jwt.service';
import { UseCase } from '@/shared/application/usecases/use-case';

export type Input = {
	token: string;
};

export type Output = {
	isValid: boolean;
};

export class VerifyRecoverPasswordTokenUseCase
	implements UseCase<Input, Output>
{
	constructor(
		private readonly jwtService: JwtService,
		private readonly envConfigService: EnvConfig,
	) {}

	async execute({ token }: Input): Promise<Output> {
		if (!token) {
			throw new BadRequestError(ErrorMessages.INVALID_TOKEN);
		}

		const recoverPasswordSecret =
			this.envConfigService.getRecoverUserPasswordTokenSecret();

		const isValid = await this.jwtService.verifyJwt(token, {
			secret: recoverPasswordSecret,
		});

		return { isValid };
	}
}
