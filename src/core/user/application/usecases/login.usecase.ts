import { Transactional } from '@/shared/application/database/decorators/transactional.decorator';
import { ErrorMessages } from '@/shared/application/error-messages/error-messages';
import { InvalidCredentialsError } from '@/shared/application/errors/invalid-credentials-error';
import { AuthService } from '@/shared/application/services/auth.service';
import { HashService } from '@/shared/application/services/hash.service';
import { SetCookies } from '@/shared/application/types/cookies';
import { UseCase } from '@/shared/application/usecases/use-case';
import { User } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository';
import { UserCookiesName } from '../constants/cookies';
import { UserOutput } from '../outputs/user-output';

export type Input = {
	email: string;
	password: string;
	setCookies: SetCookies;
};

export type Output = UserOutput;

export class LoginUseCase implements UseCase<Input, Output> {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly hashService: HashService,
		private readonly authService: AuthService,
	) {}

	@Transactional()
	async execute(input: Input): Promise<Output> {
		this.validateInput(input);

		const user = await this.userRepository.getByEmail(input.email);

		if (!user || !user.active) {
			throw new InvalidCredentialsError(ErrorMessages.INVALID_CREDENTIALS);
		}

		await this.validatePassword(input.password, user.password);

		await this.authenticateAndHandleTokens(user, input.setCookies);

		return user.toJSON();
	}

	private validateInput({ email, password }: Input): void {
		if (!email || !password) {
			throw new InvalidCredentialsError(ErrorMessages.INVALID_CREDENTIALS);
		}
	}

	private async validatePassword(inputPassword: string, userPassword: string) {
		const isPasswordCorrect = await this.hashService.compare(
			inputPassword,
			userPassword,
		);

		if (!isPasswordCorrect) {
			throw new InvalidCredentialsError(ErrorMessages.INVALID_CREDENTIALS);
		}
	}

	private async authenticateAndHandleTokens(
		user: User,
		setCookies: SetCookies,
	): Promise<void> {
		const { accessToken, refreshToken } =
			await this.authService.authenticate(user);

		this.authService.setTokensInCookies({
			accessToken,
			refreshToken,
			accessTokenName: UserCookiesName.ACCESS_TOKEN,
			refreshTokenName: UserCookiesName.REFRESH_TOKEN,
			accessTokenPath: UserCookiesName.ACCESS_TOKEN_PATH,
			refreshTokenPath: UserCookiesName.REFRESH_TOKEN_PATH,
			setCookies,
		});
	}
}
