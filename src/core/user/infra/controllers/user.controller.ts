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
import { ChangePasswordUseCase } from '../../application/usecases/recover-password/change-password.usecase';
import { SendPasswordRecoveryEmailUseCase } from '../../application/usecases/recover-password/send-password-recovery-email.usecase';
import { VerifyRecoverPasswordTokenUseCase } from '../../application/usecases/recover-password/verify-recover-password-token.usecase';
import { RefreshTokenUseCase } from '../../application/usecases/refresh-token.usecase';
import { RegisterUseCase } from '../../application/usecases/register.usecase';
import { ChangePasswordDocResponse } from '../decorators/change-password-doc.response.decorator';
import { UserCheckEmailDocResponse } from '../decorators/user-check-email-doc-response.decorator';
import { UserLoginDocResponse } from '../decorators/user-login-doc-response.decorator';
import { UserLogoutDocResponse } from '../decorators/user-logout-doc-response.decorator';
import { UserRecoverPasswordSendEmailDocResponse } from '../decorators/user-recover-password-send-email-response.decorator';
import { UserRefreshTokenDocResponse } from '../decorators/user-refresh-token-doc.response.decorator';
import { UserRegisterDocResponse } from '../decorators/user-register-doc-response.decorator';
import { VerifyRecoverPasswordTokenDocResponse } from '../decorators/verify-recover-password-token-doc-response.decorator';
import { ChangePasswordDto } from '../dtos/change-password.dto';
import { LoginDto } from '../dtos/login.dto';
import { RecoverPasswordSendEmailDto } from '../dtos/recover-password-send-email.dto';
import { RegisterDto } from '../dtos/register.dto';
import { VerifyRecoverPasswordTokenDto } from '../dtos/verify-recover-password-token.dto';
import { RecoverPasswordGuard } from '../guards/recover-password.guard';
import { RefreshTokenGuard } from '../guards/refresh-token.guard';
import { CheckEmailPresenter } from '../presenters/check-email.presenter';
import { LoginPresenter } from '../presenters/login.presenter';
import { RecoverPasswordSendEmailPresenter } from '../presenters/recover-password-send-email.presenter';
import { RegisterPresenter } from '../presenters/register.presenter';
import { VerifyRecoverPasswordTokenPresenter } from '../presenters/verify-recover-password-token.presenter';

@Controller('user')
export class UserController {
	constructor(
		private readonly registerUseCase: RegisterUseCase,
		private readonly checkEmailUseCase: CheckEmailUseCase,
		private readonly loginUseCase: LoginUseCase,
		private readonly logoutUseCase: LogoutUseCase,
		private readonly refreshTokenUseCase: RefreshTokenUseCase,
		private readonly sendPasswordRecoveryEmailUseCase: SendPasswordRecoveryEmailUseCase,
		private readonly verifyRecoverPasswordTokenUseCase: VerifyRecoverPasswordTokenUseCase,
		private readonly changePasswordUseCase: ChangePasswordUseCase,
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

	@HttpCode(200)
	@UserRecoverPasswordSendEmailDocResponse()
	@Post('/recover-password/send-email')
	async recoverUserPasswordSendEmail(
		@Body() dto: RecoverPasswordSendEmailDto,
	): Promise<RecoverPasswordSendEmailPresenter> {
		const output = await this.sendPasswordRecoveryEmailUseCase.execute(dto);
		return new RecoverPasswordSendEmailPresenter(output);
	}

	@HttpCode(200)
	@VerifyRecoverPasswordTokenDocResponse()
	@Post('/recover-password/verify-token')
	async recoverUserPasswordVerifyToken(
		@Body() dto: VerifyRecoverPasswordTokenDto,
	): Promise<VerifyRecoverPasswordTokenPresenter> {
		const output = await this.verifyRecoverPasswordTokenUseCase.execute(dto);
		return new VerifyRecoverPasswordTokenPresenter(output);
	}

	@HttpCode(204)
	@ChangePasswordDocResponse()
	@UseGuards(RecoverPasswordGuard)
	@Post('/recover-password/change-password')
	async changeUserPassword(@Body() dto: ChangePasswordDto): Promise<void> {
		return await this.changePasswordUseCase.execute(dto);
	}
}
