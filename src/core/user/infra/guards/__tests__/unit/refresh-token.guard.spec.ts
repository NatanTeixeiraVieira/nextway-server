import { UserCookiesName } from '@/core/user/application/constants/cookies';
import { UserQuery } from '@/core/user/application/queries/user.query';
import { UserDataBuilder } from '@/core/user/domain/testing/helpers/user-data-builder';
import { EnvConfig } from '@/shared/application/env-config/env-config';
import { ErrorMessages } from '@/shared/application/error-messages/error-messages';
import { BadRequestError } from '@/shared/application/errors/bad-request-error';
import { InvalidTokenError } from '@/shared/application/errors/invalid-token-error';
import { AuthenticatePayload } from '@/shared/application/services/auth.service';
import { JwtService } from '@/shared/application/services/jwt.service';
import { LoggedUserService } from '@/shared/application/services/logged-user.service';
import { ExecutionContext } from '@nestjs/common';
import { RefreshTokenGuard } from '../../refresh-token.guard';

function createMockExecutionContext(cookieValue: any): ExecutionContext {
	return {
		switchToHttp: () => ({
			getRequest: () => ({
				cookies: {
					[UserCookiesName.REFRESH_TOKEN]: cookieValue,
				},
			}),
		}),
	} as unknown as ExecutionContext;
}

describe('RefreshTokenGuard unit tests', () => {
	let sut: RefreshTokenGuard;
	let envConfigService: EnvConfig;
	let jwtService: JwtService;
	let userQuery: UserQuery;
	let loggedUserService: LoggedUserService;
	const loggedUser = UserDataBuilder();
	let context: ExecutionContext;
	let payload: AuthenticatePayload;

	beforeEach(() => {
		envConfigService = {
			getRefreshTokenSecret: jest
				.fn()
				.mockReturnValue('mockRefreshTokenSecret'),
		} as unknown as EnvConfig;

		context = createMockExecutionContext('validToken');

		payload = {
			sub: 'mockSub',
			email: 'testEmail@email.com',
		};

		jwtService = {
			verifyJwt: jest.fn().mockResolvedValue(true),
			decodeJwt: jest.fn().mockResolvedValue(payload),
		} as unknown as JwtService;

		userQuery = {
			existsActiveById: jest.fn().mockReturnValue(loggedUser),
		} as unknown as UserQuery;

		loggedUserService = {
			setLoggedUser: jest.fn(),
		} as unknown as LoggedUserService;

		sut = new RefreshTokenGuard(
			envConfigService,
			jwtService,
			userQuery,
			loggedUserService,
		);
	});

	it('should be defined', () => {
		expect(sut).toBeDefined();
	});

	it('should throw an error if no refresh token is provided', async () => {
		context = createMockExecutionContext(null);
		await expect(sut.canActivate(context)).rejects.toThrow(
			new InvalidTokenError(ErrorMessages.INVALID_REFRESH_TOKEN),
		);
	});

	it('should throw an error if refresh token is invalid', async () => {
		(jwtService.verifyJwt as jest.Mock).mockResolvedValue(false);

		await expect(sut.canActivate(context)).rejects.toThrow(
			new InvalidTokenError(ErrorMessages.INVALID_REFRESH_TOKEN),
		);
	});

	it('should throw an error if user is not found', async () => {
		(userQuery.existsActiveById as jest.Mock).mockResolvedValue(null);

		await expect(sut.canActivate(context)).rejects.toThrow(
			new BadRequestError(ErrorMessages.USER_NOT_FOUND),
		);
	});

	it('should set logged user and return true if refresh token is valid', async () => {
		const result = await sut.canActivate(context);

		expect(result).toBeTruthy();
		expect(envConfigService.getRefreshTokenSecret).toHaveBeenCalledTimes(1);

		expect(jwtService.verifyJwt).toHaveBeenCalledTimes(1);
		expect(jwtService.verifyJwt).toHaveBeenCalledWith('validToken', {
			secret: 'mockRefreshTokenSecret',
		});

		expect(jwtService.decodeJwt).toHaveBeenCalledTimes(1);
		expect(jwtService.decodeJwt).toHaveBeenCalledWith('validToken');

		expect(userQuery.existsActiveById).toHaveBeenCalledTimes(1);
		expect(userQuery.existsActiveById).toHaveBeenCalledWith('mockSub');

		expect(loggedUserService.setLoggedUser).toHaveBeenCalledTimes(1);
		expect(loggedUserService.setLoggedUser).toHaveBeenCalledWith({
			id: payload.sub,
			email: payload.email,
		});
	});
});
