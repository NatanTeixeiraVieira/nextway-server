import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	UseGuards,
} from '@/shared/infra/decorators';
import { TenantAuthGuard } from '@/shared/infra/guards/tenant-payment.guard';
import { FinishTenantPaymentUseCase } from '../../application/usecases/finish-tenant-payment.usecase';
import { InitTenantPaymentUseCase } from '../../application/usecases/init-tenant-payment.usecase';
import { TenantPaymentInitPaymentDocResponse } from '../decorators/tenant-payment-init-payment-doc-response.decorator';
import { FinishTenantPaymentDto } from '../dtos/finish-tenant-payment.dto';
import { InitTenantPaymentPresenter } from '../presenters/init-tenant-payment.presenter';

@Controller('tenant-payment')
export class TenantPaymentController {
	constructor(
		private readonly initTenantPaymentUseCase: InitTenantPaymentUseCase,
		private readonly finishTenantPaymentUseCase: FinishTenantPaymentUseCase,
	) {}

	@UseGuards(TenantAuthGuard)
	@HttpCode(HttpStatus.OK)
	@TenantPaymentInitPaymentDocResponse()
	@Post('/init-payment')
	async initTenantPayment(): Promise<InitTenantPaymentPresenter> {
		const output = await this.initTenantPaymentUseCase.execute();
		return new InitTenantPaymentPresenter(output);
	}

	// TODO Add guard to verify payment gateway token
	@Post('/finish-payment')
	async finishTenantPayment(
		@Body() dto: FinishTenantPaymentDto,
	): Promise<void> {
		await this.finishTenantPaymentUseCase.execute({
			payerId: dto.data.id,
			paymentInfos: { action: dto.action, entity: dto.entity },
		});
	}
}
