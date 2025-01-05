import {
	Body,
	Controller,
	HttpCode,
	Post,
	Res,
} from '@/shared/infra/decorators';
import { CheckEmailUseCase } from '../../application/usecases/check-email.usecase';
import { LoginUseCase } from '../../application/usecases/login.usecase';
import { RegisterUseCase } from '../../application/usecases/register.usecase';
import { UserCheckEmailDocResponse } from '../decorators/user-check-email-doc-response.decorator';
import { UserLoginDocResponse } from '../decorators/user-login-doc-response.decorator';
import { UserRegisterDocResponse } from '../decorators/user-register-doc-response.decorator';
import { LoginDto } from '../dtos/login.dto';
import { RegisterDto } from '../dtos/register.dto';
import { CheckEmailPresenter } from '../presenters/check-email.presenter';
import { LoginPresenter } from '../presenters/login.presenter';
import { RegisterPresenter } from '../presenters/register.presenter';

@Controller('user')
export class UserController {
	constructor(
		private readonly registerUseCase: RegisterUseCase,
		private readonly checkEmailUseCase: CheckEmailUseCase,
		private readonly loginUseCase: LoginUseCase,
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
		// TODO solve fastify setCookie type error
		// biome-ignore lint/suspicious/noExplicitAny: Fastify do not recognizes the setCookie
		@Res({ passthrough: true }) reply: any,
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
		// TODO solve fastify setCookie type error
		// biome-ignore lint/suspicious/noExplicitAny: Fastify do not recognizes the setCookie
		@Res({ passthrough: true }) reply: any,
		@Body() loginDto: LoginDto,
	): Promise<LoginPresenter> {
		const output = await this.loginUseCase.execute({
			...loginDto,
			setCookies: reply.setCookie.bind(reply),
		});
		return new LoginPresenter(output);
	}
}
