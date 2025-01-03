import {
	Body,
	Controller,
	HttpCode,
	Post,
	Res,
} from '@/shared/infra/decorators';
import { CheckEmailUseCase } from '../../application/usecases/check-email.usecase';
import { RegisterUseCase } from '../../application/usecases/register.usecase';
import { UserCheckEmailDocResponse } from '../decorators/user-check-email-doc-response.decorator';
import { UserRegisterDocResponse } from '../decorators/user-register-doc-response.decorator';
import { RegisterDto } from '../dtos/register.dto';
import { CheckEmailPresenter } from '../presenters/check-email.presenter';
import { RegisterPresenter } from '../presenters/register.presenter';

@Controller('user')
export class UserController {
	constructor(
		private readonly registerUseCase: RegisterUseCase,
		private readonly checkEmailUseCase: CheckEmailUseCase,
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
}
