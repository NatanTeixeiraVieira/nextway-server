import { Body, Controller, Post, Res } from '@/shared/infra/decorators';
import { FastifyReply } from 'fastify';
import { CheckTenantEmailUseCase } from '../../application/usecases/check-tenant-email.usecase';
import { RegisterTenantUseCase } from '../../application/usecases/register-tenant.usecase';
import { CheckTenantEmailDto } from '../dtos/check-tenant-email.dto';
import { RegisterTenantDto } from '../dtos/register-tenant.dto';
import { CheckTenantEmailPresenter } from '../presenters/check-tenant-email.presenter';
import { RegisterTenantPresenter } from '../presenters/register-tenant.presenter';

@Controller('tenant')
export class TenantController {
	constructor(
		private readonly registerTenantUseCase: RegisterTenantUseCase,
		private readonly checkTenantEmailUseCase: CheckTenantEmailUseCase,
	) {}

	// TODO Create documentation
	// @UserRegisterDocResponse()
	@Post('/register')
	async registerTenant(
		@Body() registerTenantDto: RegisterTenantDto,
	): Promise<RegisterTenantPresenter> {
		const output = await this.registerTenantUseCase.execute(registerTenantDto);
		return new RegisterTenantPresenter(output);
	}

	// TODO Create documentation
	@Post('/check-email')
	async checkTenantEmail(
		@Res({ passthrough: true }) reply: FastifyReply,
		@Body() registerTenantDto: CheckTenantEmailDto,
	): Promise<CheckTenantEmailPresenter> {
		const output = await this.checkTenantEmailUseCase.execute({
			...registerTenantDto,
			setCookies: reply.setCookie.bind(reply),
		});

		return new CheckTenantEmailPresenter(output);
	}
}
