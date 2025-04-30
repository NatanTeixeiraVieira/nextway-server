import { AuthService } from '@/shared/application/services/auth.service';
import { ClearCookies } from '@/shared/application/types/cookies';
import { UseCase } from '@/shared/application/usecases/use-case';
import { UserCookiesName } from '../constants/cookies';

export type Input = {
	clearCookies: ClearCookies;
};

export type Output = undefined;

export class LogoutUseCase implements UseCase<Input, Output> {
	constructor(private readonly authService: AuthService) {}

	execute({ clearCookies }: Input): Output {
		this.authService.clearAuthCookies({
			clearCookies,
			accessTokenName: UserCookiesName.ACCESS_TOKEN,
			refreshTokenName: UserCookiesName.REFRESH_TOKEN,
			accessTokenPath: UserCookiesName.ACCESS_TOKEN_PATH,
			refreshTokenPath: UserCookiesName.REFRESH_TOKEN_PATH,
		});
	}
}
