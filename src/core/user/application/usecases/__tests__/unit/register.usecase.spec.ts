import { User } from '@/core/user/domain/entities/user.entity';
import { UserRepository } from '@/core/user/domain/repositories/user.repository';
import { UserDataBuilder } from '@/core/user/domain/testing/helpers/user-data-builder';
import { ErrorMessages } from '@/shared/application/error-messages/error-messages';
import { BadRequestError } from '@/shared/application/errors/bad-request-error';
import { HashService } from '@/shared/application/services/hash.service';
import { UserOutput, UserOutputMapper } from '../../../outputs/user-output';
import { UserQuery } from '../../../queries/user.query';
import { Input, RegisterUseCase } from '../../register.usecase';

jest.mock('@/core/user/domain/entities/user.entity');

describe('RegisterUseCase unit tests', () => {
	let registerUseCase: RegisterUseCase;
	let userRepository: UserRepository;
	let userQuery: UserQuery;
	let hashService: HashService;
	let userOutputMapper: UserOutputMapper;

	beforeEach(() => {
		userRepository = {
			create: jest.fn(),
		} as unknown as UserRepository;

		userQuery = {
			emailExists: jest.fn(),
		} as unknown as UserQuery;

		hashService = {
			generate: jest.fn(),
		} as unknown as HashService;

		userOutputMapper = {
			toOutput: jest.fn(),
		} as unknown as UserOutputMapper;

		registerUseCase = new RegisterUseCase(
			userRepository,
			userQuery,
			hashService,
			userOutputMapper,
		);
	});

	it('should throw error if email is not provided', async () => {
		const input = {
			name: 'Test User',
			password: 'password123',
		} as Input;

		await expect(registerUseCase.execute(input)).rejects.toThrow(
			new BadRequestError(ErrorMessages.EMAIL_NOT_INFORMED),
		);
	});

	it('should throw error if name is not provided', async () => {
		const input = {
			email: 'test@example.com',
			password: 'password123',
		} as Input;

		await expect(registerUseCase.execute(input)).rejects.toThrow(
			new BadRequestError(ErrorMessages.NAME_NOT_INFORMED),
		);
	});

	it('should throw error if password is not provided', async () => {
		const input = {
			email: 'test@example.com',
			name: 'Test User',
		} as Input;

		await expect(registerUseCase.execute(input)).rejects.toThrow(
			new BadRequestError(ErrorMessages.PASSWORD_NOT_INFORMED),
		);
	});

	it('should throw error if email already exists', async () => {
		const input: Input = {
			email: 'test@example.com',
			name: 'Test User',
			password: 'password123',
		};

		(userQuery.emailExists as jest.Mock).mockResolvedValue(true);

		await expect(registerUseCase.execute(input)).rejects.toThrow(
			new BadRequestError(ErrorMessages.EMAIL_ALREADY_EXISTS),
		);
	});

	it('should register a new user', async () => {
		const input = {
			email: 'test@example.com',
			name: 'Test User',
			password: 'password123',
		};

		const hashedPassword =
			'$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36SmPo0QxCZT6RboUpOeGmG';

		const userOutput: UserOutput = {
			...UserDataBuilder(),
			id: '044f8f86-abb2-47ec-accc-8c811ce7ec65',
			audit: {
				createdAt: new Date(),
				updatedAt: new Date(),
				deletedAt: null,
			},
		};

		(userQuery.emailExists as jest.Mock).mockResolvedValue(false);
		(hashService.generate as jest.Mock).mockResolvedValue(hashedPassword);
		(userOutputMapper.toOutput as jest.Mock).mockReturnValue(userOutput);

		const output = await registerUseCase.execute(input);

		expect(output).toStrictEqual(userOutput);
		expect(userRepository.create).toHaveBeenCalledTimes(1);
		expect(hashService.generate).toHaveBeenCalledWith(input.password);
		expect(userOutputMapper.toOutput).toHaveBeenCalledTimes(1);
		expect(User.register).toHaveBeenCalledTimes(1);
		expect(User.register).toHaveBeenCalledWith({
			name: input.name,
			email: input.email,
			password: hashedPassword,
		});
	});
});
