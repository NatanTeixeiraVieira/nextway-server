import { UserRepository } from '@/core/user/domain/repositories/user.repository';
import { EnvConfig } from '@/shared/application/env-config/env-config';
import { ErrorMessages } from '@/shared/application/error-messages/error-messages';
import { InvalidTokenError } from '@/shared/application/errors/invalid-token-error';
import { NotFoundError } from '@/shared/application/errors/not-found-error';
import { HashService } from '@/shared/application/services/hash.service';
import { JwtService } from '@/shared/application/services/jwt.service';
import { LoggedUserService } from '@/shared/application/services/logged-user.service';
import { UseCase } from '@/shared/application/usecases/use-case';
import { RecoverPasswordPayload } from './send-password-recovery-email.usecase';

export type Input = {
	changePasswordToken: string;
	password: string;
};

export type Output = undefined;

export class ChangePasswordUseCase implements UseCase<Input, Output> {
	constructor(
		private readonly jwtService: JwtService,
		private readonly envConfigService: EnvConfig,
		private readonly userRepository: UserRepository,
		private readonly hashService: HashService,
		private readonly loggedUserService: LoggedUserService,
	) {}

	async execute(input: Input): Promise<Output> {
		await this.validateChangePasswordToken(input.changePasswordToken);

		const { sub } = await this.jwtService.decodeJwt<RecoverPasswordPayload>(
			input.changePasswordToken,
		);

		const user = await this.userRepository.getById(sub);

		if (!user) {
			throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
		}

		const hashedPassword = await this.hashService.generate(input.password);

		user.changePassword(hashedPassword);

		await this.userRepository.update(user);
	}

	private async validateChangePasswordToken(token: string): Promise<void> {
		const recoverPasswordSecret =
			this.envConfigService.getRecoverUserPasswordTokenSecret();

		const loggedUserToken =
			this.loggedUserService.getLoggedUser()
				?.forgotPasswordEmailVerificationToken;

		const isTokenEqualLoggedUserToken = token === loggedUserToken;

		if (!isTokenEqualLoggedUserToken) {
			throw new InvalidTokenError(ErrorMessages.INVALID_TOKEN);
		}

		const isValid = await this.jwtService.verifyJwt(token, {
			secret: recoverPasswordSecret,
		});

		if (!isValid) {
			throw new InvalidTokenError(ErrorMessages.INVALID_TOKEN);
		}
	}
}
