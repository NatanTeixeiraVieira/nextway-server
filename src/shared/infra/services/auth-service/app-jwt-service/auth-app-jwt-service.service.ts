import { User } from '@/core/user/domain/entities/user.entity';
import { CookiesName } from '@/shared/application/constants/cookies';
import { EnvConfig } from '@/shared/application/env-config/env-config';
import {
	Authenticate,
	AuthenticatePayload,
	AuthService,
	ClearAuthCookiesProps,
	SetTokensInCookiesProps,
} from '@/shared/application/services/auth.service';
import { JwtService } from '@/shared/application/services/jwt.service';

export class AuthAppJwtService implements AuthService {
	constructor(
		private readonly jwtService: JwtService,
		private readonly envConfigService: EnvConfig,
	) {}

	async authenticate(user: User): Promise<Authenticate> {
		const payload: AuthenticatePayload = {
			sub: user.id,
		};

		const [accessToken, refreshToken] = await Promise.all([
			this.generateAccessToken(payload),
			this.generateRefreshToken(payload),
		]);

		return {
			accessToken,
			refreshToken,
		};
	}

	setTokensInCookies({
		accessToken,
		refreshToken,
		setCookies,
	}: SetTokensInCookiesProps): void {
		const isSecure = this.envConfigService.getNodeEnv() === 'production';

		setCookies(CookiesName.ACCESS_TOKEN, accessToken, {
			httpOnly: true,
			secure: isSecure,
			maxAge: this.envConfigService.getJwtExpiresIn(),
			sameSite: 'Strict',
		});
		setCookies(CookiesName.REFRESH_TOKEN, refreshToken, {
			httpOnly: true,
			secure: isSecure,
			maxAge: this.envConfigService.getRefreshTokenExpiresIn(),
			sameSite: 'Strict',
		});
	}

	clearAuthCookies({ clearCookies }: ClearAuthCookiesProps): void {
		const isProduction = this.envConfigService.getNodeEnv() === 'production';
		const cookieOptions = {
			httpOnly: true,
			secure: isProduction,
			maxAge: 0,
			sameSite: 'Strict',
		};

		clearCookies(CookiesName.ACCESS_TOKEN, cookieOptions);
		clearCookies(CookiesName.REFRESH_TOKEN, cookieOptions);
	}

	private async generateAccessToken(
		payload: AuthenticatePayload,
	): Promise<string> {
		const accessTokenSecret = this.envConfigService.getJwtSecret();

		const accessTokenExpiresInInSeconds =
			this.envConfigService.getJwtExpiresIn();

		const { token } = await this.jwtService.generateJwt<typeof payload>(
			payload,
			{
				expiresIn: accessTokenExpiresInInSeconds,
				secret: accessTokenSecret,
			},
		);

		return token;
	}

	private async generateRefreshToken(
		payload: AuthenticatePayload,
	): Promise<string> {
		const refreshTokenSecret = this.envConfigService.getRefreshTokenSecret();

		const refreshTokenExpiresInInSeconds =
			this.envConfigService.getRefreshTokenExpiresIn();

		const { token } = await this.jwtService.generateJwt<typeof payload>(
			payload,
			{
				expiresIn: refreshTokenExpiresInInSeconds,
				secret: refreshTokenSecret,
			},
		);

		return token;
	}
}
