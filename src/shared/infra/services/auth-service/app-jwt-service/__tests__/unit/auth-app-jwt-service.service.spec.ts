import { User } from '@/core/user/domain/entities/user.entity';
import { UserDataBuilder } from '@/core/user/domain/testing/helpers/user-data-builder';
import { JwtService } from '@/shared/application/services/jwt.service';
import { EnvConfigService } from '@/shared/infra/env-config/env-config.service';
import { AuthAppJwtService } from '../../auth-app-jwt-service.service';

describe('AuthAppJwtService unit tests', () => {
	let sut: AuthAppJwtService;
	let jwtService: JwtService;
	let envConfigService: EnvConfigService;
	const envConfigValues = {
		nodeEnv: 'test',
		jwtSecret: 'jwtSecret',
		jwtExpiresIn: 800,
		refreshTokenSecret: 'tokenSecret',
		refreshTokenExpiresIn: 100,
	};

	beforeEach(() => {
		jest.clearAllMocks();
		jwtService = {
			generateJwt: jest
				.fn()
				.mockResolvedValueOnce({ token: 'mockAccessToken' })
				.mockResolvedValueOnce({ token: 'mockRefreshToken' }),
		} as unknown as JwtService;

		envConfigService = {
			getNodeEnv: jest.fn().mockReturnValue('test'),
			getJwtSecret: jest.fn().mockReturnValue(envConfigValues.jwtSecret),
			getJwtExpiresIn: jest.fn().mockReturnValue(envConfigValues.jwtExpiresIn),
			getRefreshTokenSecret: jest
				.fn()
				.mockReturnValue(envConfigValues.refreshTokenSecret),
			getRefreshTokenExpiresIn: jest
				.fn()
				.mockReturnValue(envConfigValues.refreshTokenExpiresIn),
		} as unknown as EnvConfigService;

		sut = new AuthAppJwtService(jwtService, envConfigService);
	});

	it('should be defined', () => {
		expect(sut).toBeDefined();
	});

	it('should authenticate user', async () => {
		const user = User.with({
			...UserDataBuilder(),
			id: 'c68ce367-f85b-4da7-a6cb-e9719432f552',
			audit: {
				createdAt: new Date(),
				updatedAt: new Date(),
				deletedAt: null as Date | null,
			},
		});

		const result = await sut.authenticate(user);
		expect(envConfigService.getJwtSecret).toHaveBeenCalledTimes(1);
		expect(envConfigService.getJwtExpiresIn).toHaveBeenCalledTimes(1);
		expect(jwtService.generateJwt).toHaveBeenCalledTimes(2);
		expect(jwtService.generateJwt).toHaveBeenNthCalledWith(
			1,
			{ sub: user.id, email: user.email },
			{
				expiresIn: envConfigValues.jwtExpiresIn,
				secret: envConfigValues.jwtSecret,
			},
		);
		expect(envConfigService.getRefreshTokenSecret).toHaveBeenCalledTimes(1);
		expect(envConfigService.getRefreshTokenExpiresIn).toHaveBeenCalledTimes(1);
		expect(jwtService.generateJwt).toHaveBeenNthCalledWith(
			2,
			{ sub: user.id, email: user.email },
			{
				expiresIn: envConfigValues.refreshTokenExpiresIn,
				secret: envConfigValues.refreshTokenSecret,
			},
		);

		expect(result).toStrictEqual({
			accessToken: 'mockAccessToken',
			refreshToken: 'mockRefreshToken',
		});
	});

	it('should set tokens in cookies', () => {
		const setCookies = jest.fn();

		const accessToken = 'mockAccessToken';
		const refreshToken = 'mockRefreshToken';
		const accessTokenName = 'testAccessTokenName';
		const refreshTokenName = 'testRefreshTokenName';
		const refreshTokenPath = 'testRefreshTokenPath';
		const accessTokenPath = 'testAccessTokenPath';

		sut.setTokensInCookies({
			accessToken,
			refreshToken,
			accessTokenName,
			refreshTokenName,
			refreshTokenPath,
			accessTokenPath,
			setCookies,
		});

		expect(setCookies).toHaveBeenCalledTimes(2);
		expect(setCookies).toHaveBeenNthCalledWith(
			1,
			accessTokenName,
			accessToken,
			{
				httpOnly: true,
				secure: false,
				maxAge: envConfigValues.jwtExpiresIn,
				sameSite: 'Strict',
				path: accessTokenPath,
			},
		);
		expect(setCookies).toHaveBeenNthCalledWith(
			2,
			refreshTokenName,
			refreshToken,
			{
				httpOnly: true,
				secure: false,
				maxAge: envConfigValues.refreshTokenExpiresIn,
				sameSite: 'Strict',
				path: refreshTokenPath,
			},
		);
	});

	it('should clear auth cookies', () => {
		(envConfigService.getNodeEnv as jest.Mock).mockReturnValue('test');
		const clearCookies = jest.fn();
		const refreshTokenName = 'refreshTokenName';
		const accessTokenName = 'testAccessTokenName';
		const accessTokenPath = 'testAccessTokenPath';
		const refreshTokenPath = 'testRefreshTokenPath';

		sut.clearAuthCookies({
			accessTokenPath,
			refreshTokenName,
			accessTokenName,
			refreshTokenPath,
			clearCookies,
		});

		const cookieOptions = {
			httpOnly: true,
			secure: false,
			maxAge: 0,
			sameSite: 'Strict',
		};

		expect(clearCookies).toHaveBeenCalledTimes(2);
		expect(clearCookies).toHaveBeenNthCalledWith(1, accessTokenName, {
			...cookieOptions,
			path: accessTokenPath,
		});
		expect(clearCookies).toHaveBeenNthCalledWith(2, refreshTokenName, {
			...cookieOptions,
			path: refreshTokenPath,
		});
	});

	it('should refresh token', async () => {
		const user = User.with({
			...UserDataBuilder(),
			id: 'c68ce367-f85b-4da7-a6cb-e9719432f552',
			audit: {
				createdAt: new Date(),
				updatedAt: new Date(),
				deletedAt: null as Date | null,
			},
		});

		const result = await sut.refresh(user);
		expect(envConfigService.getJwtSecret).toHaveBeenCalledTimes(1);
		expect(envConfigService.getJwtExpiresIn).toHaveBeenCalledTimes(1);
		expect(jwtService.generateJwt).toHaveBeenCalledTimes(1);
		expect(jwtService.generateJwt).toHaveBeenCalledWith(
			{ sub: user.id, email: user.email },
			{
				expiresIn: envConfigValues.jwtExpiresIn,
				secret: envConfigValues.jwtSecret,
			},
		);

		expect(result).toStrictEqual({
			accessToken: 'mockAccessToken',
		});
	});

	it('should set access token in cookies', () => {
		const setCookies = jest.fn();
		const accessToken = 'mockAccessToken';
		const accessTokenName = 'testName';
		const accessTokenPath = 'testPath';

		sut.setAccessTokenInCookies({
			accessToken,
			accessTokenName,
			accessTokenPath,
			setCookies,
		});

		expect(setCookies).toHaveBeenCalledTimes(1);
		expect(setCookies).toHaveBeenCalledWith(accessTokenName, accessToken, {
			httpOnly: true,
			secure: false,
			maxAge: envConfigValues.jwtExpiresIn,
			sameSite: 'Strict',
			path: accessTokenPath,
		});
	});
});
