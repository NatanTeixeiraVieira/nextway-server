import { ErrorMessages } from '@/shared/application/error-messages/error-messages';
import { BadRequestError } from '@/shared/application/errors/bad-request-error';
import { HashService } from '@/shared/application/services/hash.service';
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

export class RegisterUseCase implements UseCase<Input, Output> {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly userQuery: UserQuery,
		private readonly hashService: HashService,
		private readonly userOutputMapper: UserOutputMapper,
	) {}

	async execute(input: Input): Promise<Output> {
		this.validateInput(input);

		const { email, name, password } = input;

		await this.validateEmailExists(email);

		const hashedPassword = await this.hashService.generate(password);

		const user = User.register({
			name,
			email,
			password: hashedPassword,
		});

		await this.userRepository.create(user);

		return this.userOutputMapper.toOutput(user);
	}

	private validateInput(input: Input): void {
		if (!input.email) {
			throw new BadRequestError(ErrorMessages.EMAIL_NOT_INFORMED);
		}

		if (!input.name) {
			throw new BadRequestError(ErrorMessages.NAME_NOT_INFORMED);
		}

		if (!input.password) {
			throw new BadRequestError(ErrorMessages.PASSWORD_NOT_INFORMED);
		}
	}

	private async validateEmailExists(email: string): Promise<void> {
		const emailExists = await this.userQuery.emailExists(email);

		if (emailExists) {
			throw new BadRequestError(ErrorMessages.EMAIL_ALREADY_EXISTS);
		}
	}
}
