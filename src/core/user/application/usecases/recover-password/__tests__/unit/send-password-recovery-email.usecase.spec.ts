import { UserOutputMapper } from '@/core/user/application/outputs/user-output';
import { UserRepository } from '@/core/user/domain/repositories/user.repository';
import { UserDataBuilder } from '@/core/user/domain/testing/helpers/user-data-builder';
import { mockTransactionTest } from '@/shared/application/database/decorators/testing/mock-transaction-test';
import { EnvConfig } from '@/shared/application/env-config/env-config';
import { ErrorMessages } from '@/shared/application/error-messages/error-messages';
import { BadRequestError } from '@/shared/application/errors/bad-request-error';
import { NotFoundError } from '@/shared/application/errors/not-found-error';
import { JwtService } from '@/shared/application/services/jwt.service';
import { MailService } from '@/shared/application/services/mail.service';
import { SendPasswordRecoveryEmailUseCase } from '../../send-password-recovery-email.usecase';

jest.mock(
	'@/shared/application/database/decorators/transactional.decorator',
	() => mockTransactionTest(),
);

describe('SendPasswordRecoveryEmailUseCase unit tests', () => {
	let sut: SendPasswordRecoveryEmailUseCase;
	let userRepository: UserRepository;
	let mailService: MailService;
	let jwtService: JwtService;
	let envConfigService: EnvConfig;
	let userOutputMapper: UserOutputMapper;

	const userMock = {
		...UserDataBuilder(),
		active: true,
		id: '6813cded-666b-4464-8874-42dba1be4627',

		createEmailForgotPasswordEmailVerificationToken: jest.fn(),
	};

	beforeEach(() => {
		jest.clearAllMocks();
		userRepository = {
			getByEmail: jest.fn().mockResolvedValue(userMock),
			update: jest.fn(),
		} as unknown as UserRepository;

		mailService = {
			sendMail: jest.fn(),
		} as unknown as MailService;
		jwtService = {
			generateJwt: jest.fn().mockResolvedValue({ token: 'test_token' }),
		} as unknown as JwtService;
		envConfigService = {
			getRecoverUserPasswordTokenSecret: jest
				.fn()
				.mockReturnValue('getRecoverUserPasswordTokenSecret'),
			getRecoverUserPasswordTokenExpiresIn: jest.fn().mockReturnValue(100),
			getBaseUrl: jest.fn().mockReturnValue('http://localhost:3000'),
		} as unknown as EnvConfig;
		userOutputMapper = {
			toOutput: jest.fn(),
		} as unknown as UserOutputMapper;

		sut = new SendPasswordRecoveryEmailUseCase(
			userRepository,
			mailService,
			jwtService,
			envConfigService,
			userOutputMapper,
		);
	});

	it('should throw an error if email is not informed', async () => {
		await expect(sut.execute({ email: '' })).rejects.toThrow(
			new BadRequestError(ErrorMessages.EMAIL_NOT_INFORMED),
		);
	});

	it('should throw an error if user is not found', async () => {
		(userRepository.getByEmail as jest.Mock).mockResolvedValue(null);

		await expect(sut.execute({ email: 'test@email.com' })).rejects.toThrow(
			new NotFoundError(ErrorMessages.userNotFoundByEmail('test@email.com')),
		);
	});

	it('should throw an error if user is inactive', async () => {
		(userRepository.getByEmail as jest.Mock).mockResolvedValue({
			...UserDataBuilder(),
			active: false,
		});

		await expect(sut.execute({ email: 'test@email.com' })).rejects.toThrow(
			new BadRequestError(ErrorMessages.INACTIVE_USER),
		);
	});

	it('should send password recovery email', async () => {
		const output = await sut.execute({ email: 'test@email.com' });

		expect(userRepository.getByEmail).toHaveBeenCalledTimes(1);
		expect(userRepository.getByEmail).toHaveBeenCalledWith('test@email.com');

		expect(
			envConfigService.getRecoverUserPasswordTokenSecret,
		).toHaveBeenCalledTimes(1);
		expect(
			envConfigService.getRecoverUserPasswordTokenExpiresIn,
		).toHaveBeenCalledTimes(1);
		expect(jwtService.generateJwt).toHaveBeenCalledTimes(1);
		expect(jwtService.generateJwt).toHaveBeenCalledWith(
			{ sub: userMock.id, email: userMock.email },
			{
				expiresIn: 100,
				secret: 'getRecoverUserPasswordTokenSecret',
			},
		);

		expect(
			userMock.createEmailForgotPasswordEmailVerificationToken,
		).toHaveBeenCalledTimes(1);
		expect(
			userMock.createEmailForgotPasswordEmailVerificationToken,
		).toHaveBeenCalledWith('test_token');

		expect(userRepository.update).toHaveBeenCalledTimes(1);
		expect(userRepository.update).toHaveBeenCalledWith(userMock);

		expect(envConfigService.getBaseUrl).toHaveBeenCalledTimes(1);

		expect(mailService.sendMail).toHaveBeenCalledTimes(1);
		expect(mailService.sendMail).toHaveBeenCalledWith({
			to: 'test@email.com',
			subject: 'Recuperação de senha',
			content: `
      Olá ${userMock.name}, uma recuperação de senha foi solicitada. <br>
      Clique no link abaixo para definir uma nova senha. <br />
      http://localhost:3000/recover-password/test_token
    `,
		});
	});
});
