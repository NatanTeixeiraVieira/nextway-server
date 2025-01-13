import {
	Body,
	Controller,
	HttpCode,
	Post,
	Res,
	UseGuards,
} from '@/shared/infra/decorators';
import { FastifyReply } from 'fastify/types/reply';
import { CheckEmailUseCase } from '../../application/usecases/check-email.usecase';
import { LoginUseCase } from '../../application/usecases/login.usecase';
import { LogoutUseCase } from '../../application/usecases/logout.usecase';
import { RefreshTokenUseCase } from '../../application/usecases/refresh-token.usecase';
import { RegisterUseCase } from '../../application/usecases/register.usecase';
import { UserCheckEmailDocResponse } from '../decorators/user-check-email-doc-response.decorator';
import { UserLoginDocResponse } from '../decorators/user-login-doc-response.decorator';
import { UserLogoutDocResponse } from '../decorators/user-logout-doc-response.decorator';
import { UserRefreshTokenDocResponse } from '../decorators/user-refresh-token-doc.response.decorator';
import { UserRegisterDocResponse } from '../decorators/user-register-doc-response.decorator';
import { LoginDto } from '../dtos/login.dto';
import { RegisterDto } from '../dtos/register.dto';
import { RefreshTokenGuard } from '../guards/refresh-token.guard';
import { CheckEmailPresenter } from '../presenters/check-email.presenter';
import { LoginPresenter } from '../presenters/login.presenter';
import { RegisterPresenter } from '../presenters/register.presenter';

@Controller('user')
export class UserController {
	constructor(
		private readonly registerUseCase: RegisterUseCase,
		private readonly checkEmailUseCase: CheckEmailUseCase,
		private readonly loginUseCase: LoginUseCase,
		private readonly logoutUseCase: LogoutUseCase,
		private readonly refreshTokenUseCase: RefreshTokenUseCase,
	) {}

	@UserRegisterDocResponse()
	@Post('/register')
	async registerUser(
		@Body() registerDto: RegisterDto,
	): Promise<RegisterPresenter> {
		const output = await this.registerUseCase.execute(registerDto);
		return new RegisterPresenter(output);
	}

	@HttpCode(200)
	@UserCheckEmailDocResponse()
	@Post('/check-email')
	async checkUserEmail(
		@Res({ passthrough: true }) reply: FastifyReply,
		@Body('token') checkEmailToken: string,
	): Promise<CheckEmailPresenter> {
		const output = await this.checkEmailUseCase.execute({
			checkEmailToken,
			setCookies: reply.setCookie.bind(reply),
		});
		return new CheckEmailPresenter(output);
	}

	@HttpCode(200)
	@UserLoginDocResponse()
	@Post('/login')
	async userLogin(
		@Res({ passthrough: true }) reply: FastifyReply,
		@Body() loginDto: LoginDto,
	): Promise<LoginPresenter> {
		const output = await this.loginUseCase.execute({
			...loginDto,
			setCookies: reply.setCookie.bind(reply),
		});
		return new LoginPresenter(output);
	}

	@HttpCode(200)
	@UserLogoutDocResponse()
	@Post('/logout')
	userLogout(@Res({ passthrough: true }) reply: FastifyReply): void {
		this.logoutUseCase.execute({
			clearCookies: reply.clearCookie.bind(reply),
		});
	}

	@HttpCode(200)
	@UserRefreshTokenDocResponse()
	@UseGuards(RefreshTokenGuard)
	@Post('/refresh')
	async refreshUserToken(
		@Res({ passthrough: true }) reply: FastifyReply,
	): Promise<void> {
		await this.refreshTokenUseCase.execute({
			setCookies: reply.setCookie.bind(reply),
		});
	}
}
