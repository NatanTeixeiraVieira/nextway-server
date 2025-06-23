import { User } from '@/core/user/domain/entities/user.entity';
import { UserRepository } from '@/core/user/domain/repositories/user.repository';
import { EnvConfig } from '@/shared/application/env-config/env-config';
import { ErrorMessages } from '@/shared/application/error-messages/error-messages';
import { BadRequestError } from '@/shared/application/errors/bad-request-error';
import { HashService } from '@/shared/application/services/hash.service';
import { JwtService } from '@/shared/application/services/jwt.service';
import { MailService } from '@/shared/application/services/mail.service';
import { UnitOfWork } from '@/shared/application/unit-of-work/unit-of-work';
import { UserOutputMapper } from '../../../outputs/user-output';
import { UserQuery } from '../../../queries/user.query';
import { Input, RegisterUseCase } from '../../register.usecase';

jest.mock('@/core/user/domain/entities/user.entity');
// jest.mock(
// 	'@/shared/application/database/decorators/transactional.decorator',
// 	() => mockTransactionTest(),
// );

describe('RegisterUseCase unit tests', () => {
	let sut: RegisterUseCase;
	let userRepository: UserRepository;
	let userQuery: UserQuery;
	let hashService: HashService;
	let mailService: MailService;
	let jwtService: JwtService;
	let envConfigService: EnvConfig;
	let userOutputMapper: UserOutputMapper;
	let uow: UnitOfWork;

	beforeEach(() => {
		jest.clearAllMocks();

		userRepository = {
			create: jest.fn(),
			update: jest.fn(),
			getByEmail: jest.fn(),
		} as unknown as UserRepository;

		userQuery = {
			emailAccountActiveExists: jest.fn(),
		} as unknown as UserQuery;

		hashService = {
			generate: jest.fn(),
		} as unknown as HashService;

		userOutputMapper = {
			toOutput: jest.fn(),
		} as unknown as UserOutputMapper;

		mailService = {
			sendMail: jest.fn(),
		} as unknown as MailService;

		jwtService = {
			generateJwt: jest.fn(),
		} as unknown as JwtService;

		envConfigService = {
			getJwtActiveAccountSecret: jest.fn(),
			getJwtActiveAccountExpiresIn: jest.fn(),
			getClientBaseUrl: jest.fn(),
		} as unknown as EnvConfig;

		uow = {
			execute: jest.fn().mockImplementation((fn) => fn()),
		};

		sut = new RegisterUseCase(
			uow,
			userRepository,
			userQuery,
			hashService,
			mailService,
			jwtService,
			envConfigService,
			userOutputMapper,
		);
	});

	it('should throw error if email is not provided', async () => {
		const input = {
			name: 'Test User',
			password: 'password123',
		} as Input;

		await expect(sut.execute(input)).rejects.toThrow(
			new BadRequestError(ErrorMessages.EMAIL_NOT_INFORMED),
		);
	});

	it('should throw error if name is not provided', async () => {
		const input = {
			email: 'test@example.com',
			password: 'password123',
		} as Input;

		await expect(sut.execute(input)).rejects.toThrow(
			new BadRequestError(ErrorMessages.NAME_NOT_INFORMED),
		);
	});

	it('should throw error if password is not provided', async () => {
		const input = {
			email: 'test@example.com',
			name: 'Test User',
		} as Input;

		await expect(sut.execute(input)).rejects.toThrow(
			new BadRequestError(ErrorMessages.PASSWORD_NOT_INFORMED),
		);
	});

	it('should throw error if email already exists', async () => {
		const input: Input = {
			email: 'test@example.com',
			name: 'Test User',
			password: 'password123',
		};

		(userQuery.emailAccountActiveExists as jest.Mock).mockResolvedValue(true);

		await expect(sut.execute(input)).rejects.toThrow(
			new BadRequestError(ErrorMessages.EMAIL_ALREADY_EXISTS),
		);
	});

	it('should register a new user and send activation email', async () => {
		const input: Input = {
			email: 'test@example.com',
			name: 'Test User',
			password: 'password123',
		};

		const hashedPassword = 'hashedPassword';
		const userOutput = {
			id: '5237eab8-e492-4708-b6f6-4d8af33a0ff9',
			email: input.email,
			name: input.name,
			phoneNumber: null,
			emailVerified: null,
			active: false,
		};

		const user = {
			id: '5237eab8-e492-4708-b6f6-4d8af33a0ff9',
			name: input.name,
			email: input.email,
			password: hashedPassword,
		};

		const baseUrl = 'https://test-url.com.br';
		const content = `
      Olá ${input.name}, para ativar sua conta no Nextway clique no link abaixo: <br>
      ${baseUrl}/activate-account/activateAccountToken
    `;

		(userQuery.emailAccountActiveExists as jest.Mock).mockResolvedValue(false);
		(hashService.generate as jest.Mock).mockResolvedValue(hashedPassword);
		(userOutputMapper.toOutput as jest.Mock).mockReturnValue(userOutput);
		(envConfigService.getClientBaseUrl as jest.Mock).mockReturnValue(baseUrl);
		(jwtService.generateJwt as jest.Mock).mockResolvedValue({
			token: 'activateAccountToken',
		});
		(User.register as jest.Mock).mockReturnValue(user);

		const output = await sut.execute(input);

		expect(output).toEqual(userOutput);

		// TODO Fix the Transactional test due the jest.clearAllMocks() clear this mock
		// expect(Transactional).toHaveBeenCalledTimes(1);

		expect(hashService.generate).toHaveBeenCalledTimes(1);
		expect(hashService.generate).toHaveBeenCalledWith(input.password);

		expect(User.register).toHaveBeenCalledTimes(1);
		expect(User.register).toHaveBeenCalledWith({
			name: input.name,
			email: input.email,
			password: hashedPassword,
		});

		expect(userRepository.create).toHaveBeenCalledTimes(1);
		expect(userRepository.create).toHaveBeenCalledWith(user);

		expect(userOutputMapper.toOutput).toHaveBeenCalledTimes(1);
		expect(userOutputMapper.toOutput).toHaveBeenCalledWith(user);

		expect(mailService.sendMail).toHaveBeenCalledTimes(1);
		expect(mailService.sendMail).toHaveBeenCalledWith({
			to: input.email,
			subject: 'Ative seu cadastro no Nextway',
			content,
		});
	});

	it('should update an existing user and send activation email', async () => {
		const input: Input = {
			email: 'test@example.com',
			name: 'Test User',
			password: 'password123',
		};

		const hashedPassword = 'hashedPassword';
		const existingUser = {
			id: '5237eab8-e492-4708-b6f6-4d8af33a0ff9',
			name: 'Old Name',
			email: input.email,
			password: 'oldHashedPassword',
			register: jest.fn(),
		};

		const userOutput = {
			id: existingUser.id,
			email: input.email,
			name: input.name,
			phoneNumber: null,
			emailVerified: null,
			active: false,
		};

		const baseUrl = 'https://test-url.com.br';
		const content = `
      Olá ${input.name}, para ativar sua conta no Nextway clique no link abaixo: <br>
      ${baseUrl}/activate-account/activateAccountToken
    `;

		(userQuery.emailAccountActiveExists as jest.Mock).mockResolvedValue(false);
		(hashService.generate as jest.Mock).mockResolvedValue(hashedPassword);
		(userOutputMapper.toOutput as jest.Mock).mockReturnValue(userOutput);
		(envConfigService.getClientBaseUrl as jest.Mock).mockReturnValue(baseUrl);
		(jwtService.generateJwt as jest.Mock).mockResolvedValue({
			token: 'activateAccountToken',
		});
		(userRepository.getByEmail as jest.Mock).mockResolvedValue(existingUser);

		const output = await sut.execute(input);

		expect(output).toEqual(userOutput);

		expect(hashService.generate).toHaveBeenCalledTimes(1);
		expect(hashService.generate).toHaveBeenCalledWith(input.password);

		expect(existingUser.register).toHaveBeenCalledTimes(1);
		expect(existingUser.register).toHaveBeenCalledWith({
			name: input.name,
			email: input.email,
			password: hashedPassword,
		});
		expect(User.register).not.toHaveBeenCalled();

		expect(userRepository.update).toHaveBeenCalledTimes(1);
		expect(userRepository.update).toHaveBeenCalledWith(existingUser);

		expect(userRepository.create).not.toHaveBeenCalled();

		expect(userOutputMapper.toOutput).toHaveBeenCalledTimes(1);
		expect(userOutputMapper.toOutput).toHaveBeenCalledWith(existingUser);

		expect(mailService.sendMail).toHaveBeenCalledTimes(1);
		expect(mailService.sendMail).toHaveBeenCalledWith({
			to: input.email,
			subject: 'Ative seu cadastro no Nextway',
			content,
		});
	});
});
