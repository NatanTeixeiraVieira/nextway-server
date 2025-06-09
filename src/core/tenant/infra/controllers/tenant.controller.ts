import { MessagingTopics } from '@/shared/application/constants/messaging';
import { Providers } from '@/shared/application/constants/providers';
import { MessagingService } from '@/shared/application/services/messaging.service';
import { Body, Controller, Inject, Post, Res } from '@/shared/infra/decorators';
import { CommonMessagingService } from '@/shared/infra/services/messaging-service/common-messaging.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { FastifyReply } from 'fastify';
import { CheckTenantEmailUseCase } from '../../application/usecases/check-tenant-email.usecase';
import { handleFinishedPaymentUseCase } from '../../application/usecases/handle-finished-payment.usecase';
import { RegisterTenantUseCase } from '../../application/usecases/register-tenant.usecase';
import { CheckTenantEmailDto } from '../dtos/check-tenant-email.dto';
import { HandleFinishedPaymentDto } from '../dtos/handle-finished-payment.dto';
import { RegisterTenantDto } from '../dtos/register-tenant.dto';
import { CheckTenantEmailPresenter } from '../presenters/check-tenant-email.presenter';
import { RegisterTenantPresenter } from '../presenters/register-tenant.presenter';

@Controller('tenant')
export class TenantController {
	constructor(
		private readonly registerTenantUseCase: RegisterTenantUseCase,
		private readonly checkTenantEmailUseCase: CheckTenantEmailUseCase,
		private readonly handleFinishedPaymentUseCase: handleFinishedPaymentUseCase,
		private readonly commonMessagingService: CommonMessagingService,
		@Inject(Providers.MESSAGING_SERVICE)
		private readonly messagingService: MessagingService,
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

	@EventPattern(MessagingTopics.PAYMENT_FINISHED)
	async handleFinishedPayment(
		@Payload() data: HandleFinishedPaymentDto,
		@Ctx() context: RmqContext,
	): Promise<void> {
		await this.messagingService.handleErrors(async () => {
			await this.handleFinishedPaymentUseCase.execute({
				nextDueDate: data.nextDueDate,
				tenantId: data.tenantId,
			});
			this.commonMessagingService.ack(context);
		});
	}
}
