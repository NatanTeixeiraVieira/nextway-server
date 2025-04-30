import { Providers } from '@/shared/application/constants/providers';
import { EnvConfig } from '@/shared/application/env-config/env-config';
import { ErrorMessages } from '@/shared/application/error-messages/error-messages';
import { InvalidTokenError } from '@/shared/application/errors/invalid-token-error';
import { NotFoundError } from '@/shared/application/errors/not-found-error';
import { AuthenticatePayload } from '@/shared/application/services/auth.service';
import { JwtService } from '@/shared/application/services/jwt.service';
import { LoggedUserService } from '@/shared/application/services/logged-user.service';
import {
	CanActivate,
	ExecutionContext,
	Inject,
} from '@/shared/infra/framework/common';
import { UserCookiesName } from '../../application/constants/cookies';
import { UserProviders } from '../../application/constants/providers';
import { UserRepository } from '../../domain/repositories/user.repository';

export class RefreshTokenGuard implements CanActivate {
	constructor(
		@Inject(Providers.ENV_CONFIG_SERVICE)
		private readonly envConfigService: EnvConfig,
		@Inject(Providers.JWT_SERVICE)
		private readonly jwtService: JwtService,
		@Inject(UserProviders.USER_REPOSITORY)
		private readonly userRepository: UserRepository,
		@Inject(Providers.LOGGED_USER_SERVICE)
		private readonly loggedUserService: LoggedUserService,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const refreshToken = request.cookies[UserCookiesName.REFRESH_TOKEN];

		if (!refreshToken) {
			throw new InvalidTokenError(ErrorMessages.INVALID_REFRESH_TOKEN);
		}

		const refreshTokenSecret = this.envConfigService.getRefreshTokenSecret();

		const isRefreshTokenValid = await this.jwtService.verifyJwt(refreshToken, {
			secret: refreshTokenSecret,
		});

		if (!isRefreshTokenValid) {
			throw new InvalidTokenError(ErrorMessages.INVALID_REFRESH_TOKEN);
		}

		const jwtPayload =
			await this.jwtService.decodeJwt<AuthenticatePayload>(refreshToken);

		const loggedUser = await this.userRepository.getById(jwtPayload.sub);

		if (!loggedUser) {
			throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
		}

		this.loggedUserService.setLoggedUser(loggedUser);

		return true;
	}
}
