import { UserRepository } from '@/core/user/domain/repositories/user.repository';
import { EnvConfig } from '@/shared/application/env-config/env-config';
import { ErrorMessages } from '@/shared/application/error-messages/error-messages';
import { InvalidTokenError } from '@/shared/application/errors/invalid-token-error';
import { NotFoundError } from '@/shared/application/errors/not-found-error';
import { HashService } from '@/shared/application/services/hash.service';
import { JwtService } from '@/shared/application/services/jwt.service';
import { LoggedUserService } from '@/shared/application/services/logged-user.service';
import { ChangePasswordUseCase } from '../../change-password.usecase';

describe('ChangePasswordUseCase unit tests', () => {
	let sut: ChangePasswordUseCase;
	let jwtService: JwtService;
	let envConfigService: EnvConfig;
	let userRepository: UserRepository;
	let hashService: HashService;
	let loggedUserService: LoggedUserService;
	let userChangePassword: jest.Mock;

	beforeEach(() => {
		jest.clearAllMocks();

		jwtService = {
			decodeJwt: jest
				.fn()
				.mockResolvedValue({ sub: 'b0b3eae5-439c-4267-8544-c5fdb1568108' }),
			verifyJwt: jest.fn().mockResolvedValue(true),
		} as unknown as JwtService;

		envConfigService = {
			getRecoverUserPasswordTokenSecret: jest
				.fn()
				.mockReturnValue('secret_test'),
		} as unknown as EnvConfig;

		userChangePassword = jest.fn();

		userRepository = {
			getById: jest
				.fn()
				.mockResolvedValue({ changePassword: userChangePassword }),
			update: jest.fn(),
		} as unknown as UserRepository;

		hashService = {
			generate: jest.fn().mockResolvedValue('hashed_password_test'),
		} as unknown as HashService;

		loggedUserService = {
			getLoggedUser: jest.fn().mockReturnValue({
				forgotPasswordEmailVerificationToken: 'valid_token',
			}),
		} as unknown as LoggedUserService;

		sut = new ChangePasswordUseCase(
			jwtService,
			userRepository,
			hashService,
			loggedUserService,
		);
	});

	it('should throw an error when change password token is invalid', async () => {
		(jwtService.verifyJwt as jest.Mock).mockResolvedValue(false);

		await expect(
			sut.execute({
				changePasswordToken: 'invalid_token',
				password: 'password_test',
			}),
		).rejects.toThrow(
			new InvalidTokenError(ErrorMessages.INVALID_CHANGE_PASSWORD_TOKEN),
		);
	});

	it('should throw an error when user is not found', async () => {
		(userRepository.getById as jest.Mock).mockResolvedValue(null);
		(loggedUserService.getLoggedUser as jest.Mock).mockReturnValue({
			forgotPasswordEmailVerificationToken: 'invalid_token',
		});

		await expect(
			sut.execute({
				changePasswordToken: 'invalid_token',
				password: 'password_test',
			}),
		).rejects.toThrow(new NotFoundError(ErrorMessages.USER_NOT_FOUND));
	});

	it('should throw an error when user token is not equal logged user token', async () => {
		(userRepository.getById as jest.Mock).mockResolvedValue(null);

		await expect(
			sut.execute({
				changePasswordToken: 'invalid_token',
				password: 'password_test',
			}),
		).rejects.toThrow(
			new NotFoundError(ErrorMessages.INVALID_CHANGE_PASSWORD_TOKEN),
		);
	});

	it('should change user password', async () => {
		await sut.execute({
			changePasswordToken: 'valid_token',
			password: 'password_test',
		});

		expect(jwtService.decodeJwt).toHaveBeenCalledTimes(1);
		expect(jwtService.decodeJwt).toHaveBeenCalledWith('valid_token');

		expect(userRepository.getById).toHaveBeenCalledTimes(1);
		expect(userRepository.getById).toHaveBeenCalledWith(
			'b0b3eae5-439c-4267-8544-c5fdb1568108',
		);

		expect(hashService.generate).toHaveBeenCalledTimes(1);
		expect(hashService.generate).toHaveBeenCalledWith('password_test');

		expect(userChangePassword).toHaveBeenCalledTimes(1);
		expect(userChangePassword).toHaveBeenCalledWith('hashed_password_test');

		expect(userRepository.update).toHaveBeenCalledTimes(1);
		expect(userRepository.update).toHaveBeenCalledWith({
			changePassword: userChangePassword,
		});
	});
});
