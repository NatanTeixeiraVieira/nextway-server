import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	UseGuards,
} from '@/shared/infra/decorators';
import { TenantAuthGuard } from '@/shared/infra/guards/tenant-payment.guard';
import { InitTenantPaymentUseCase } from '../../application/usecases/init-tenant-payment.usecase';
import { TenantPaymentInitPaymentDocResponse } from '../decorators/tenant-payment-init-payment-doc-response.decorator';
import { InitTenantPaymentDto } from '../dtos/init-tenant-payment.dto';
import { InitTenantPaymentPresenter } from '../presenters/init-tenant-payment.presenter';

@Controller('tenant-payment')
export class TenantPaymentController {
	constructor(
		private readonly initTenantPaymentUseCase: InitTenantPaymentUseCase,
	) {}

	@UseGuards(TenantAuthGuard)
	@HttpCode(HttpStatus.OK)
	@TenantPaymentInitPaymentDocResponse()
	@Post('/init-payment')
	async initTenantPayment(
		@Body() initTenantPaymentDto: InitTenantPaymentDto,
	): Promise<InitTenantPaymentPresenter> {
		const output =
			await this.initTenantPaymentUseCase.execute(initTenantPaymentDto);
		return new InitTenantPaymentPresenter(output);
	}
}
