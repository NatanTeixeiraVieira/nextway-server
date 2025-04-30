import { Transactional } from '@/shared/application/database/decorators/transactional.decorator';
import { EnvConfig } from '@/shared/application/env-config/env-config';
import { ErrorMessages } from '@/shared/application/error-messages/error-messages';
import { InvalidTokenError } from '@/shared/application/errors/invalid-token-error';
import { NotFoundError } from '@/shared/application/errors/not-found-error';
import { AuthService } from '@/shared/application/services/auth.service';
import { JwtService } from '@/shared/application/services/jwt.service';
import { SetCookies } from '@/shared/application/types/cookies';
import { UseCase } from '@/shared/application/usecases/use-case';
import { User } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository';
import { UserCookiesName } from '../constants/cookies';
import { UserOutput } from '../outputs/user-output';
import { RegisterPayload } from './register.usecase';

export type Input = {
	checkEmailToken: string;
	setCookies: SetCookies;
};

export type Output = UserOutput;

export class CheckEmailUseCase implements UseCase<Input, Output> {
	constructor(
		private readonly envConfigService: EnvConfig,
		private readonly jwtService: JwtService,
		private readonly userRepository: UserRepository,
		private readonly authService: AuthService,
	) {}

	@Transactional()
	async execute({ checkEmailToken, setCookies }: Input): Promise<UserOutput> {
		await this.validateCheckEmailToken(checkEmailToken);

		const { sub } =
			await this.jwtService.decodeJwt<RegisterPayload>(checkEmailToken);

		const user = await this.userRepository.getById(sub);

		if (!user) {
			throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
		}

		this.validateUserExists(user);

		user.checkEmail();

		await this.userRepository.update(user);

		await this.authenticateAndHandleTokens(user, setCookies);

		return user.toJSON();
	}

	private validateUserExists(user: User | null) {
		if (!user) {
			throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
		}
	}

	private async validateCheckEmailToken(
		checkEmailToken: string,
	): Promise<void> {
		const jwtActivateAccountSecret =
			this.envConfigService.getJwtActiveAccountSecret();

		const isValidToken = await this.jwtService.verifyJwt(checkEmailToken, {
			secret: jwtActivateAccountSecret,
		});

		if (!isValidToken) {
			throw new InvalidTokenError(ErrorMessages.INVALID_TOKEN);
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
			setCookies,
			accessTokenName: UserCookiesName.ACCESS_TOKEN,
			refreshTokenName: UserCookiesName.REFRESH_TOKEN,
			accessTokenPath: UserCookiesName.ACCESS_TOKEN_PATH,
			refreshTokenPath: UserCookiesName.REFRESH_TOKEN_PATH,
		});
	}
}
