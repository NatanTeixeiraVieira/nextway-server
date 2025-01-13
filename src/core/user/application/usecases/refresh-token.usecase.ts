import { ErrorMessages } from '@/shared/application/error-messages/error-messages';
import { BadRequestError } from '@/shared/application/errors/bad-request-error';
import { AuthService } from '@/shared/application/services/auth.service';
import { LoggedUserService } from '@/shared/application/services/logged-user.service';
import { SetCookies } from '@/shared/application/types/cookies';
import { UseCase } from '@/shared/application/usecases/use-case';

export type Input = {
	setCookies: SetCookies;
};

export type Output = undefined;

export class RefreshTokenUseCase implements UseCase<Input, Output> {
	constructor(
		private readonly authService: AuthService,
		private readonly loggedUserService: LoggedUserService,
	) {}

	async execute({ setCookies }: Input): Promise<Output> {
		const loggedUser = this.loggedUserService.getLoggedUser();

		if (!loggedUser) {
			throw new BadRequestError(ErrorMessages.USER_NOT_FOUND);
		}

		const { accessToken } = await this.authService.refresh(loggedUser);

		this.authService.setAccessTokenInCookies({ accessToken, setCookies });
	}
}
