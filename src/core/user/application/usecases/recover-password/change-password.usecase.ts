import { UserRepository } from '@/core/user/domain/repositories/user.repository';
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
		private readonly userRepository: UserRepository,
		private readonly hashService: HashService,
		private readonly loggedUserService: LoggedUserService,
	) {}

	async execute(input: Input): Promise<Output> {
		const { sub } = await this.jwtService.decodeJwt<RecoverPasswordPayload>(
			input.changePasswordToken,
		);

		const user = await this.userRepository.getById(sub);

		if (!user) {
			throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
		}

		await this.validateChangePasswordToken(
			input.changePasswordToken,
			user.forgotPasswordEmailVerificationToken,
		);

		const hashedPassword = await this.hashService.generate(input.password);

		user.changePassword(hashedPassword);

		await this.userRepository.update(user);
	}

	private async validateChangePasswordToken(
		token: string,
		loggedUserToken: string | null,
	): Promise<void> {
		const isTokenEqualLoggedUserToken = token === loggedUserToken;

		if (!isTokenEqualLoggedUserToken || !loggedUserToken) {
			throw new InvalidTokenError(ErrorMessages.INVALID_CHANGE_PASSWORD_TOKEN);
		}
	}
}
