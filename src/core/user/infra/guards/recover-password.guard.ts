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
import { UserProviders } from '../../application/constants/providers';
import { UserQuery } from '../../application/queries/user.query';
import { ChangePasswordDto } from '../dtos/change-password.dto';

export class RecoverPasswordGuard implements CanActivate {
	constructor(
		@Inject(Providers.ENV_CONFIG_SERVICE)
		private readonly envConfigService: EnvConfig,
		@Inject(Providers.JWT_SERVICE)
		private readonly jwtService: JwtService,
		@Inject(UserProviders.USER_QUERY)
		private readonly userQuery: UserQuery,
		@Inject(Providers.LOGGED_USER_SERVICE)
		private readonly loggedUserService: LoggedUserService,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const { changePasswordToken }: ChangePasswordDto = request.body;

		if (!changePasswordToken) {
			throw new InvalidTokenError(ErrorMessages.INVALID_CHANGE_PASSWORD_TOKEN);
		}

		const recoverUserPasswordTokenSecret =
			this.envConfigService.getRecoverUserPasswordTokenSecret();

		const isRefreshTokenValid = await this.jwtService.verifyJwt(
			changePasswordToken,
			{
				secret: recoverUserPasswordTokenSecret,
			},
		);

		if (!isRefreshTokenValid) {
			throw new InvalidTokenError(ErrorMessages.INVALID_CHANGE_PASSWORD_TOKEN);
		}

		const jwtPayload =
			await this.jwtService.decodeJwt<AuthenticatePayload>(changePasswordToken);

		const loggedUserExists = await this.userQuery.existsActiveById(
			jwtPayload.sub,
		);

		if (!loggedUserExists) {
			throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
		}

		this.loggedUserService.setLoggedUser({ id: jwtPayload.sub });

		return true;
	}
}
