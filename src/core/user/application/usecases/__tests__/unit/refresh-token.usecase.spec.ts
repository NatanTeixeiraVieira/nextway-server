import { UserDataBuilder } from '@/core/user/domain/testing/helpers/user-data-builder';
import { ErrorMessages } from '@/shared/application/error-messages/error-messages';
import { BadRequestError } from '@/shared/application/errors/bad-request-error';
import { AuthService } from '@/shared/application/services/auth.service';
import { LoggedUserService } from '@/shared/application/services/logged-user.service';
import { UserCookiesName } from '../../../constants/cookies';
import { RefreshTokenUseCase } from '../../refresh-token.usecase';

describe('RefreshTokenUseCase unit tests', () => {
	let sut: RefreshTokenUseCase;

	let authService: AuthService;
	let loggedUserService: LoggedUserService;
	const user = UserDataBuilder();
	const setCookies = jest.fn();

	beforeEach(() => {
		jest.clearAllMocks();

		authService = {
			setAccessTokenInCookies: jest.fn(),
			refresh: jest.fn().mockReturnValue({ accessToken: 'mockAccessToken' }),
		} as unknown as AuthService;

		loggedUserService = {
			getLoggedUser: jest.fn().mockReturnValue(user),
		} as unknown as LoggedUserService;

		sut = new RefreshTokenUseCase(authService, loggedUserService);
	});

	it('should throw error when logged user is not found', async () => {
		(loggedUserService.getLoggedUser as jest.Mock).mockReturnValue(null);
		await expect(sut.execute({ setCookies })).rejects.toThrow(
			new BadRequestError(ErrorMessages.USER_NOT_FOUND),
		);
	});

	it('should refresh user token', async () => {
		await sut.execute({ setCookies });

		expect(authService.refresh).toHaveBeenCalledTimes(1);
		expect(authService.refresh).toHaveBeenCalledWith(user);

		expect(authService.setAccessTokenInCookies).toHaveBeenCalledWith({
			accessToken: 'mockAccessToken',
			accessTokenName: UserCookiesName.ACCESS_TOKEN,
			accessTokenPath: UserCookiesName.REFRESH_TOKEN_PATH,
			setCookies,
		});
	});
});
