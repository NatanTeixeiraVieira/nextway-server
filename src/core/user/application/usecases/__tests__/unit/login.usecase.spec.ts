import { User, UserProps } from '@/core/user/domain/entities/user.entity';
import { UserRepository } from '@/core/user/domain/repositories/user.repository';
import { UserDataBuilder } from '@/core/user/domain/testing/helpers/user-data-builder';
import { mockTransactionTest } from '@/shared/application/database/decorators/testing/mock-transaction-test';
import { ErrorMessages } from '@/shared/application/error-messages/error-messages';
import { InvalidCredentialsError } from '@/shared/application/errors/invalid-credentials-error';
import { AuthService } from '@/shared/application/services/auth.service';
import { HashService } from '@/shared/application/services/hash.service';
import { EntityProps } from '@/shared/domain/entities/entity';
import { UserCookiesName } from '../../../constants/cookies';
import { Input, LoginUseCase } from '../../login.usecase';

jest.mock(
	'@/shared/application/database/decorators/transactional.decorator',
	() => mockTransactionTest(),
);

describe('LoginUseCase unit tests', () => {
	let sut: LoginUseCase;

	let userRepository: UserRepository;
	let hashService: HashService;
	let authService: AuthService;
	const toJsonOutput = {
		...UserDataBuilder(),
		id: '21b53291-ffb0-4aa7-ab0c-3363439eb81d',
		audit: {
			createdAt: new Date(),
			updatedAt: new Date(),
			deletedAt: null,
		},
	};
	let toJSON: UserProps & EntityProps;
	let input: Input;
	const setCookies = jest.fn();
	let user: User;

	beforeEach(() => {
		jest.clearAllMocks();

		input = {
			email: 'test@email.com',
			password: 'test password',
			setCookies,
		};

		toJSON = jest.fn().mockReturnValue(toJsonOutput) as unknown as UserProps &
			EntityProps;

		user = {
			password: 'test password',
			active: true,
			toJSON,
		} as unknown as User;

		userRepository = {
			getByEmail: jest.fn().mockResolvedValue(user),
		} as unknown as UserRepository;

		hashService = {
			compare: jest.fn().mockReturnValue(true),
		} as unknown as HashService;

		authService = {
			authenticate: jest.fn().mockReturnValue({
				accessToken: 'test accessToken',
				refreshToken: 'test refreshToken',
			}),
			setTokensInCookies: jest.fn(),
		} as unknown as AuthService;

		sut = new LoginUseCase(userRepository, hashService, authService);
	});

	it('should throw error when email is not provided', async () => {
		const input = {
			password: 'fake password',
			setCookies: jest.fn(),
		} as unknown as Input;

		await expect(sut.execute(input)).rejects.toThrow(
			new InvalidCredentialsError(ErrorMessages.INVALID_CREDENTIALS),
		);
	});

	it('should throw error when password is not provided', async () => {
		input = {
			email: 'fake email',
			setCookies: jest.fn(),
		} as unknown as Input;

		await expect(sut.execute(input)).rejects.toThrow(
			new InvalidCredentialsError(ErrorMessages.INVALID_CREDENTIALS),
		);
	});

	it('should throw error when user not found', async () => {
		(userRepository.getByEmail as jest.Mock).mockResolvedValue(null);

		await expect(sut.execute(input)).rejects.toThrow(
			new InvalidCredentialsError(ErrorMessages.INVALID_CREDENTIALS),
		);
	});

	it('should throw error when user is not not active', async () => {
		(user as any).active = false;

		(userRepository.getByEmail as jest.Mock).mockResolvedValue(user);

		await expect(sut.execute(input)).rejects.toThrow(
			new InvalidCredentialsError(ErrorMessages.INVALID_CREDENTIALS),
		);
	});

	it('should throw error when password is not correct', async () => {
		(hashService.compare as jest.Mock).mockResolvedValue(false);

		await expect(sut.execute(input)).rejects.toThrow(
			new InvalidCredentialsError(ErrorMessages.INVALID_CREDENTIALS),
		);
	});

	it('should do user login', async () => {
		const output = await sut.execute(input);

		expect(userRepository.getByEmail).toHaveBeenCalledTimes(1);
		expect(userRepository.getByEmail).toHaveBeenCalledWith(input.email);

		expect(hashService.compare).toHaveBeenCalledTimes(1);
		expect(hashService.compare).toHaveBeenCalledWith(
			input.password,
			'test password',
		);

		expect(authService.authenticate).toHaveBeenCalledTimes(1);
		expect(authService.authenticate).toHaveBeenCalledWith(user);

		expect(authService.setTokensInCookies).toHaveBeenCalledTimes(1);
		expect(authService.setTokensInCookies).toHaveBeenCalledWith({
			accessToken: 'test accessToken',
			refreshToken: 'test refreshToken',
			accessTokenName: UserCookiesName.ACCESS_TOKEN,
			refreshTokenName: UserCookiesName.REFRESH_TOKEN,
			accessTokenPath: UserCookiesName.ACCESS_TOKEN_PATH,
			refreshTokenPath: UserCookiesName.REFRESH_TOKEN_PATH,
			setCookies,
		});

		expect(toJSON).toHaveBeenCalledTimes(1);

		expect(output).toStrictEqual(toJsonOutput);
	});
});
