import { EnvConfig } from '@/shared/application/env-config/env-config';
import { ErrorMessages } from '@/shared/application/error-messages/error-messages';
import { BadRequestError } from '@/shared/application/errors/bad-request-error';
import { HashService } from '@/shared/application/services/hash.service';
import { JwtService } from '@/shared/application/services/jwt.service';
import { MailService } from '@/shared/application/services/mail.service';
import { UnitOfWork } from '@/shared/application/unit-of-work/unit-of-work';
import { UseCase } from '@/shared/application/usecases/use-case';
import { User } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository';
import { UserOutput, UserOutputMapper } from '../outputs/user-output';
import { UserQuery } from '../queries/user.query';

export type Input = {
	email: string;
	password: string;
	name: string;
};

export type Output = UserOutput;

export type RegisterPayload = {
	sub: string;
	email: string;
};

export class RegisterUseCase implements UseCase<Input, Output> {
	constructor(
		private readonly uow: UnitOfWork,
		private readonly userRepository: UserRepository,
		private readonly userQuery: UserQuery,
		private readonly hashService: HashService,
		private readonly mailService: MailService,
		private readonly jwtService: JwtService,
		private readonly envConfigService: EnvConfig,
		private readonly userOutputMapper: UserOutputMapper,
	) {}

	async execute(input: Input): Promise<Output> {
		return this.uow.execute(async () => {
			this.validateInput(input);

			const { email, name, password } = input;

			await this.validateEmailAlreadyInUse(email);

			const user = await this.createUser(name, email, password);

			const activateAccountToken =
				await this.generateActivateAccountToken(user);

			await this.sendActivateAccountEmail(name, email, activateAccountToken);

			return this.userOutputMapper.toOutput(user);
		});
	}

	private validateInput(input?: Partial<Input>): void {
		if (!input?.email) {
			throw new BadRequestError(ErrorMessages.EMAIL_NOT_INFORMED);
		}

		if (!input?.name) {
			throw new BadRequestError(ErrorMessages.NAME_NOT_INFORMED);
		}

		if (!input?.password) {
			throw new BadRequestError(ErrorMessages.PASSWORD_NOT_INFORMED);
		}
	}

	private async validateEmailAlreadyInUse(email: string): Promise<void> {
		const emailExists = await this.userQuery.emailAccountActiveExists(email);

		if (emailExists) {
			throw new BadRequestError(ErrorMessages.EMAIL_ALREADY_EXISTS);
		}
	}

	private async createUser(
		name: string,
		email: string,
		password: string,
	): Promise<User> {
		const hashedPassword = await this.hashService.generate(password);

		const registerProps = {
			name,
			email,
			password: hashedPassword,
		};

		const userFound = await this.userRepository.getByEmail(email);

		if (userFound) {
			userFound.register(registerProps);
			await this.userRepository.update(userFound);
			return userFound;
		}

		const user = User.register(registerProps);
		await this.userRepository.create(user);

		return user;
	}

	private async generateActivateAccountToken(user: User): Promise<string> {
		const payload: RegisterPayload = {
			sub: user.id,
			email: user.email,
		};

		const jwtActivateAccountSecret =
			this.envConfigService.getJwtActiveAccountSecret();

		const jwtActivateAccountExpiresInInSeconds =
			this.envConfigService.getJwtActiveAccountExpiresIn();

		const activateAccountToken =
			await this.jwtService.generateJwt<RegisterPayload>(payload, {
				expiresIn: jwtActivateAccountExpiresInInSeconds,
				secret: jwtActivateAccountSecret,
			});

		return activateAccountToken.token;
	}

	private async sendActivateAccountEmail(
		userName: string,
		userEmail: string,
		activateAccountToken: string,
	): Promise<void> {
		const baseUrl = this.envConfigService.getClientBaseUrl();
		const content = `
      Olá ${userName}, para ativar sua conta no Nextway clique no link abaixo: <br>
      ${baseUrl}/activate-account/${activateAccountToken}
    `;

		const mailOptions = {
			to: userEmail,
			subject: 'Ative seu cadastro no Nextway',
			content,
		};

		await this.mailService.sendMail(mailOptions);
	}
}
