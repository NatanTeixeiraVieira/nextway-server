import { ErrorMessages } from '@/shared/application/error-messages/error-messages';
import { InvalidTokenError } from '@/shared/application/errors/invalid-token-error';
import { NotFoundError } from '@/shared/application/errors/not-found-error';
import { RecoverPasswordGuard } from '../../recover-password.guard';

function createMockExecutionContext(tokenValue: any) {
	return {
		switchToHttp: () => ({
			getRequest: () => ({
				body: {
					changePasswordToken: tokenValue,
				},
			}),
		}),
	} as any;
}

describe('RecoverPasswordGuard', () => {
	let sut: RecoverPasswordGuard;
	let envConfigService: any;
	let jwtService: any;
	let userQuery: any;
	let loggedUserService: any;
	let context: any;
	let payload: any;

	beforeEach(() => {
		envConfigService = {
			getRecoverUserPasswordTokenSecret: jest.fn().mockReturnValue('secret'),
		};
		jwtService = {
			verifyJwt: jest.fn(),
			decodeJwt: jest.fn(),
		};
		userQuery = {
			existsActiveById: jest.fn(),
		};
		loggedUserService = {
			setLoggedUser: jest.fn(),
		};
		payload = {
			sub: 'user-id',
			email: 'user@email.com',
		};
		context = createMockExecutionContext('validToken');
		sut = new RecoverPasswordGuard(
			envConfigService,
			jwtService,
			userQuery,
			loggedUserService,
		);
	});

	it('should throw InvalidTokenError if no changePasswordToken is provided', async () => {
		context = createMockExecutionContext(undefined);
		await expect(sut.canActivate(context)).rejects.toThrow(
			new InvalidTokenError(ErrorMessages.INVALID_CHANGE_PASSWORD_TOKEN),
		);
	});

	it('should throw InvalidTokenError if token is invalid', async () => {
		jwtService.verifyJwt.mockResolvedValue(false);
		await expect(sut.canActivate(context)).rejects.toThrow(
			new InvalidTokenError(ErrorMessages.INVALID_CHANGE_PASSWORD_TOKEN),
		);
	});

	it('should throw NotFoundError if user does not exist', async () => {
		jwtService.verifyJwt.mockResolvedValue(true);
		jwtService.decodeJwt.mockResolvedValue(payload);
		userQuery.existsActiveById.mockResolvedValue(false);

		await expect(sut.canActivate(context)).rejects.toThrow(
			new NotFoundError(ErrorMessages.USER_NOT_FOUND),
		);
	});

	it('should set logged user and return true if token and user are valid', async () => {
		jwtService.verifyJwt.mockResolvedValue(true);
		jwtService.decodeJwt.mockResolvedValue(payload);
		userQuery.existsActiveById.mockResolvedValue(true);

		const result = await sut.canActivate(context);

		expect(
			envConfigService.getRecoverUserPasswordTokenSecret,
		).toHaveBeenCalledTimes(1);
		expect(jwtService.verifyJwt).toHaveBeenCalledTimes(1);
		expect(jwtService.verifyJwt).toHaveBeenCalledWith('validToken', {
			secret: 'secret',
		});
		expect(jwtService.decodeJwt).toHaveBeenCalledWith('validToken');
		expect(userQuery.existsActiveById).toHaveBeenCalledWith(payload.sub);
		expect(loggedUserService.setLoggedUser).toHaveBeenCalledWith({
			id: payload.sub,
			email: payload.email,
		});
		expect(result).toBe(true);
	});
});
