import { Providers } from '@/shared/application/constants/providers';
import { EnvConfig } from '@/shared/application/env-config/env-config';
import { ErrorMessages } from '@/shared/application/error-messages/error-messages';
import { InternalServerError } from '@/shared/application/errors/internal-server-error';
import {
	CreateSignatureProps,
	CreateSignatureResponse,
	GrantFinishedPaymentProps,
	GrantFinishedPaymentResponse,
	PaymentInfos,
	PlanPaymentService,
} from '@/shared/application/services/plan-payment.service';
import { Inject } from '@/shared/infra/decorators/index';
import MercadoPagoConfig, { PreApproval } from 'mercadopago';

export class PlanPaymentMercadopagoService implements PlanPaymentService {
	private readonly preApproval: PreApproval;

	constructor(
		@Inject(Providers.ENV_CONFIG_SERVICE)
		private readonly envConfigService: EnvConfig,
	) {
		const client = new MercadoPagoConfig({
			accessToken: envConfigService.getPaymentAccessToken(),
			options: { timeout: 5000 },
		});

		this.preApproval = new PreApproval(client);
	}

	async createSignature(
		props: CreateSignatureProps,
	): Promise<CreateSignatureResponse> {
		const payerEmail = this.getPayerEmail(props.payerEmail);
		const response = await this.preApproval.create({
			body: {
				payer_email: payerEmail,
				auto_recurring: {
					frequency: 1,
					frequency_type: 'months',
					transaction_amount: props.planPrice,
					currency_id: 'BRL',
				},
				reason: 'Subscription',
				status: 'pending',
				external_reference: props.payerId,
				back_url: this.envConfigService.getPaymentRedirectUrl(),
			},
		});

		if (!response.id || !response.init_point) {
			throw new InternalServerError(ErrorMessages.FAILED_TO_CREATE_SIGNATURE);
		}

		return { initUrl: response.init_point };
	}

	isPaymentFinished(paymentInfos: PaymentInfos): boolean {
		return (
			paymentInfos.action === 'updated' && paymentInfos.entity === 'preapproval'
		);
	}

	async grantFinishedPayment(
		props: GrantFinishedPaymentProps,
	): Promise<GrantFinishedPaymentResponse | null> {
		const response = await this.preApproval.get({ id: props.payerId });

		if (
			!response.external_reference ||
			response.status !== 'authorized' ||
			!response.next_payment_date
		) {
			return null;
		}

		return {
			applicationPayerId: response.external_reference,
			nextPaymentDate: new Date(response.next_payment_date),
		};
	}

	private getPayerEmail(payerEmail: string): string {
		const nodeEnv = this.envConfigService.getNodeEnv();
		if (nodeEnv !== 'production') {
			return this.envConfigService.getPaymentTestPayerEmail();
		}

		return payerEmail;
	}
}
