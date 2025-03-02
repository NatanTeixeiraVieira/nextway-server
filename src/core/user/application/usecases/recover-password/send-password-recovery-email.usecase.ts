import { User } from '@/core/user/domain/entities/user.entity';
import { UserRepository } from '@/core/user/domain/repositories/user.repository';
import { Transactional } from '@/shared/application/database/decorators/transactional.decorator';
import { EnvConfig } from '@/shared/application/env-config/env-config';
import { ErrorMessages } from '@/shared/application/error-messages/error-messages';
import { BadRequestError } from '@/shared/application/errors/bad-request-error';
import { NotFoundError } from '@/shared/application/errors/not-found-error';
import { JwtService } from '@/shared/application/services/jwt.service';
import { MailService } from '@/shared/application/services/mail.service';
import { UseCase } from '@/shared/application/usecases/use-case';
import { UserOutput, UserOutputMapper } from '../../outputs/user-output';

export type Input = {
	email: string;
};

export type Output = UserOutput;

export type RecoverPasswordPayload = {
	sub: string;
	email: string;
};

export class SendPasswordRecoveryEmailUseCase
	implements UseCase<Input, Output>
{
	constructor(
		private readonly userRepository: UserRepository,
		private readonly mailService: MailService,
		private readonly jwtService: JwtService,
		private readonly envConfigService: EnvConfig,
		private readonly userOutputMapper: UserOutputMapper,
	) {}

	@Transactional()
	async execute({ email }: Input): Promise<Output> {
		this.validateEmail(email);

		const user = await this.userRepository.getByEmail(email);

		if (!user) {
			throw new NotFoundError(ErrorMessages.userNotFoundByEmail(email));
		}

		await this.validateUserActive(user);

		const recoverPasswordToken = await this.generateRecoverPasswordToken(user);

		user.createEmailForgotPasswordEmailVerificationToken(recoverPasswordToken);

		await this.userRepository.update(user);

		await this.sendRecoverPasswordEmail(user.name, email, recoverPasswordToken);

		return this.userOutputMapper.toOutput(user);
	}

	private validateEmail(email: string): void {
		if (!email) {
			throw new BadRequestError(ErrorMessages.EMAIL_NOT_INFORMED);
		}
	}

	private async validateUserActive(user: User): Promise<void> {
		if (!user.active) {
			throw new BadRequestError(ErrorMessages.INACTIVE_USER);
		}
	}

	private async generateRecoverPasswordToken(user: User): Promise<string> {
		const payload: RecoverPasswordPayload = {
			sub: user.id,
			email: user.email,
		};

		const recoverPasswordSecret =
			this.envConfigService.getRecoverUserPasswordTokenSecret();

		const recoverPasswordExpiresInInSeconds =
			this.envConfigService.getRecoverUserPasswordTokenExpiresIn();

		const recoverPasswordToken =
			await this.jwtService.generateJwt<RecoverPasswordPayload>(payload, {
				expiresIn: recoverPasswordExpiresInInSeconds,
				secret: recoverPasswordSecret,
			});

		return recoverPasswordToken.token;
	}

	private async sendRecoverPasswordEmail(
		userName: string,
		userEmail: string,
		recoverPasswordToken: string,
	): Promise<void> {
		const baseUrl = this.envConfigService.getClientBaseUrl();
		const content = `
      Olá ${userName}, uma recuperação de senha foi solicitada. <br>
      Clique no link abaixo para definir uma nova senha. <br />
      ${baseUrl}/recover-password/${recoverPasswordToken}
    `;

		const mailOptions = {
			to: userEmail,
			subject: 'Recuperação de senha',
			content,
		};

		await this.mailService.sendMail(mailOptions);
	}
}
