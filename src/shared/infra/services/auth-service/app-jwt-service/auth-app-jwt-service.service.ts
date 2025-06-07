import { EnvConfig } from '@/shared/application/env-config/env-config';
import {
	Authenticate,
	AuthenticatePayload,
	AuthService,
	BaseClient,
	ClearAuthCookiesProps,
	Refresh,
	SetAccessTokenInCookies,
	SetTokensInCookiesProps,
} from '@/shared/application/services/auth.service';
import { JwtService } from '@/shared/application/services/jwt.service';

export class AuthAppJwtService implements AuthService {
	constructor(
		private readonly jwtService: JwtService,
		private readonly envConfigService: EnvConfig,
	) {}

	async authenticate<Client extends BaseClient>(
		client: Client,
	): Promise<Authenticate> {
		const payload: AuthenticatePayload = {
			sub: client.id,
			email: client.email,
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

	async refresh<Client extends BaseClient>(client: Client): Promise<Refresh> {
		const payload: AuthenticatePayload = {
			sub: client.id,
			email: client.email,
		};
		const accessToken = await this.generateAccessToken(payload);

		return { accessToken };
	}

	setTokensInCookies({
		accessToken,
		refreshToken,
		accessTokenName,
		refreshTokenName,
		refreshTokenPath,
		accessTokenPath,
		setCookies,
	}: SetTokensInCookiesProps): void {
		const isSecure = this.envConfigService.getNodeEnv() === 'production';

		this.setAccessTokenInCookies({
			accessToken,
			setCookies,
			accessTokenPath,
			accessTokenName,
		});

		setCookies(refreshTokenName, refreshToken, {
			httpOnly: true,
			secure: isSecure,
			maxAge: this.envConfigService.getRefreshTokenExpiresIn(),
			sameSite: 'Strict',
			path: refreshTokenPath,
		});
	}

	setAccessTokenInCookies({
		accessToken,
		accessTokenPath,
		accessTokenName,
		setCookies,
	}: SetAccessTokenInCookies): void {
		const isSecure = this.envConfigService.getNodeEnv() === 'production';

		setCookies(accessTokenName, accessToken, {
			httpOnly: true,
			secure: isSecure,
			maxAge: this.envConfigService.getJwtExpiresIn(),
			sameSite: 'Strict',
			path: accessTokenPath,
		});
	}

	clearAuthCookies({
		accessTokenName,
		refreshTokenName,
		accessTokenPath,
		refreshTokenPath,
		clearCookies,
	}: ClearAuthCookiesProps): void {
		const isProduction = this.envConfigService.getNodeEnv() === 'production';
		const cookieOptions = {
			httpOnly: true,
			secure: isProduction,
			maxAge: 0,
			sameSite: 'Strict',
		};

		clearCookies(accessTokenName, { ...cookieOptions, path: accessTokenPath });
		clearCookies(refreshTokenName, {
			...cookieOptions,
			path: refreshTokenPath,
		});
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
