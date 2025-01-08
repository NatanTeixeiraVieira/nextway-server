import { AuthService } from '@/shared/application/services/auth.service';
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
		const output = await sut.execute({ clearCookies: jest.fn() });

		expect(authService.clearAuthCookies).toHaveBeenCalledTimes(1);
		expect(authService.clearAuthCookies).toHaveBeenCalledWith({
			clearCookies: expect.any(Function),
		});
		expect(output).toBeUndefined();
	});
});
