import { TenantCookiesName } from '@/shared/application/constants/cookies';
import { Providers } from '@/shared/application/constants/providers';
import { EnvConfig } from '@/shared/application/env-config/env-config';
import { ErrorMessages } from '@/shared/application/error-messages/error-messages';
import { UnauthorizedError } from '@/shared/application/errors/unauthorized-error';
import { AuthenticatePayload } from '@/shared/application/services/auth.service';
import { JwtService } from '@/shared/application/services/jwt.service';
import { LoggedTenantService } from '@/shared/application/services/logged-tenant.service';
import {
	CanActivate,
	ExecutionContext,
	Inject,
	Injectable,
} from '@/shared/infra/decorators/index';

@Injectable()
export class TenantAuthGuard implements CanActivate {
	constructor(
		@Inject(Providers.JWT_SERVICE)
		private readonly jwtService: JwtService,
		@Inject(Providers.LOGGED_TENANT_SERVICE)
		private readonly loggedTenantService: LoggedTenantService,
		@Inject(Providers.ENV_CONFIG_SERVICE)
		private readonly envConfigService: EnvConfig,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const token = request.cookies[TenantCookiesName.ACCESS_TOKEN];

		const unauthorizedMessage = ErrorMessages.INVALID_TOKEN;

		if (!token) {
			throw new UnauthorizedError(unauthorizedMessage);
		}

		try {
			const isTokenValid = await this.jwtService.verifyJwt(token, {
				secret: this.envConfigService.getJwtSecret(),
			});

			if (!isTokenValid) {
				throw new UnauthorizedError(unauthorizedMessage);
			}

			const payload =
				await this.jwtService.decodeJwt<AuthenticatePayload>(token);

			this.loggedTenantService.setLoggedTenant({ id: payload.sub });
		} catch (_error) {
			throw new UnauthorizedError(unauthorizedMessage);
		}

		return true;
	}
}
