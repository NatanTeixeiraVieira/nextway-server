import { AuthService } from '@/shared/application/services/auth.service';
import { UserCookiesName } from '../../../constants/cookies';
import { LogoutUseCase } from '../../logout.usecase';

describe('LogoutUseCase unit tests', () => {
	let sut: LogoutUseCase;
	let authService: AuthService;

	beforeEach(() => {
		authService = {
			clearAuthCookies: jest.fn(),
		} as unknown as AuthService;

		sut = new LogoutUseCase(authService);
	});

	it('should clear cookies', async () => {
		const output = sut.execute({ clearCookies: jest.fn() });

		expect(authService.clearAuthCookies).toHaveBeenCalledTimes(1);
		expect(authService.clearAuthCookies).toHaveBeenCalledWith({
			clearCookies: expect.any(Function),
			accessTokenName: UserCookiesName.ACCESS_TOKEN,
			refreshTokenName: UserCookiesName.REFRESH_TOKEN,
			accessTokenPath: UserCookiesName.ACCESS_TOKEN_PATH,
			refreshTokenPath: UserCookiesName.REFRESH_TOKEN_PATH,
		});
		expect(output).toBeUndefined();
	});
});
