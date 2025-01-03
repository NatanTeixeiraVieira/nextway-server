import { User } from '@/core/user/domain/entities/user.entity';
import { UserRepository } from '@/core/user/domain/repositories/user.repository';
import { UserDataBuilder } from '@/core/user/domain/testing/helpers/user-data-builder';
import { mockTransactionTest } from '@/shared/application/database/decorators/testing/mock-transaction-test';
import { EnvConfig } from '@/shared/application/env-config/env-config';
import { ErrorMessages } from '@/shared/application/error-messages/error-messages';
import { BadRequestError } from '@/shared/application/errors/bad-request-error';
import { NotFoundError } from '@/shared/application/errors/not-found-error';
import { AuthService } from '@/shared/application/services/auth.service';
import { JwtService } from '@/shared/application/services/jwt.service';
import { CheckEmailUseCase } from '../../check-email.usecase';

jest.mock(
	'@/shared/application/database/decorators/transactional.decorator',
	() => mockTransactionTest(),
);
describe('CheckEmailUseCase unit tests', () => {
	let sut: CheckEmailUseCase;
	let envConfigService: EnvConfig;
	let jwtService: JwtService;
	let userRepository: UserRepository;
	let authService: AuthService;
	let user: User;

	const envConfigValues = {
		jwtActivateAccountSecret: 'jwtActivateAccountSecretTest',
	};

	beforeEach(() => {
		envConfigService = {
			getJwtActiveAccountSecret: jest
				.fn()
				.mockReturnValue(envConfigValues.jwtActivateAccountSecret),
		} as unknown as EnvConfig;

		jwtService = {
			decodeJwt: jest.fn().mockReturnValue({ sub: 'subTest' }),
			verifyJwt: jest.fn().mockReturnValue(true),
		} as unknown as JwtService;

		user = {
			checkEmail: jest.fn(),
			toJSON: jest.fn().mockReturnValue({
				...UserDataBuilder(),
				id: 'af125402-913f-4f71-8872-cc06310b7508',
				audit: {
					createdAt: new Date(),
					updatedAt: new Date(),
					deletedAt: null,
				},
			}),
		} as unknown as User;

		userRepository = {
			getById: jest.fn().mockReturnValue(user),
			update: jest.fn(),
		} as unknown as UserRepository;

		authService = {
			authenticate: jest.fn().mockResolvedValue({
				accessToken: 'accessTokenTest',
				refreshToken: 'refreshTokenTest',
			}),

			setTokensInCookies: jest.fn(),
		};

		sut = new CheckEmailUseCase(
			envConfigService,
			jwtService,
			userRepository,
			authService,
		);
	});

	it('should throw error when checkEmailToken is invalid', async () => {
		(jwtService.verifyJwt as jest.Mock).mockReturnValue(false);

		await expect(
			sut.execute({ checkEmailToken: 'fakeToken', setCookies: () => {} }),
		).rejects.toThrow(new BadRequestError(ErrorMessages.INVALID_TOKEN));
	});

	it('should throw error when user is invalid', async () => {
		(userRepository.getById as jest.Mock).mockReturnValue(null);

		await expect(
			sut.execute({ checkEmailToken: 'token', setCookies: () => {} }),
		).rejects.toThrow(new NotFoundError(ErrorMessages.USER_NOT_FOUND));
	});

	it('should check the user email and do the login', async () => {
		const setCookies = jest.fn();
		const output = await sut.execute({
			checkEmailToken: 'checkEmailToken',
			setCookies,
		});

		expect(envConfigService.getJwtActiveAccountSecret).toHaveBeenCalledTimes(1);
		expect(jwtService.verifyJwt).toHaveBeenCalledTimes(1);
		expect(jwtService.verifyJwt).toHaveBeenCalledWith('checkEmailToken', {
			secret: envConfigValues.jwtActivateAccountSecret,
		});

		expect(jwtService.decodeJwt).toHaveBeenCalledTimes(1);
		expect(jwtService.decodeJwt).toHaveBeenCalledWith('checkEmailToken');

		expect(userRepository.getById).toHaveBeenCalledTimes(1);
		expect(userRepository.getById).toHaveBeenCalledWith('subTest');

		expect(user.checkEmail).toHaveBeenCalledTimes(1);

		expect(userRepository.update).toHaveBeenCalledTimes(1);
		expect(userRepository.update).toHaveBeenCalledWith(user);

		expect(authService.authenticate).toHaveBeenCalledTimes(1);
		expect(authService.authenticate).toHaveBeenCalledWith(user);

		expect(authService.setTokensInCookies).toHaveBeenCalledTimes(1);
		expect(authService.setTokensInCookies).toHaveBeenCalledWith({
			accessToken: 'accessTokenTest',
			refreshToken: 'refreshTokenTest',
			setCookies,
		});

		expect(user.toJSON).toHaveBeenCalledTimes(1);

		expect(output).toEqual(user.toJSON());
	});
});
