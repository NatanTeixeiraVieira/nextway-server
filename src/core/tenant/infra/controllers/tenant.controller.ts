import { Body, Controller, Post } from '@/shared/infra/decorators';
import { RegisterTenantUseCase } from '../../application/usecases/register-tenant.usecase';
import { RegisterTenantDto } from '../dtos/register-tenant.dto';
import { RegisterTenantPresenter } from '../presenters/register-tenant.presenter';

@Controller('tenant')
export class TenantController {
	constructor(private readonly registerTenantUseCase: RegisterTenantUseCase) {}

	// @UserRegisterDocResponse()
	@Post('/register')
	async registerTenant(
		@Body() registerTenantDto: RegisterTenantDto,
	): Promise<RegisterTenantPresenter> {
		const output = await this.registerTenantUseCase.execute(registerTenantDto);
		return new RegisterTenantPresenter(output);
	}
}
