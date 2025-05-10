import { EnvConfig } from '@/shared/application/env-config/env-config';
import { ErrorMessages } from '@/shared/application/error-messages/error-messages';
import { InternalServerError } from '@/shared/application/errors/internal-server-error';
import {
	CreateSignatureProps,
	CreateSignatureResponse,
	PlanPaymentService,
} from '@/shared/application/services/plan-payment.service';
import MercadoPagoConfig, { PreApproval } from 'mercadopago';

export class PlanPaymentMercadopagoService implements PlanPaymentService {
	private readonly preApproval: PreApproval;

	constructor(envConfigService: EnvConfig) {
		const client = new MercadoPagoConfig({
			accessToken: envConfigService.getPaymentAccessToken(),
			options: { timeout: 5000 },
		});

		this.preApproval = new PreApproval(client);
	}

	async createSignature(
		props: CreateSignatureProps,
	): Promise<CreateSignatureResponse> {
		const response = await this.preApproval.create({
			body: {
				payer_email: props.payerEmail,
				card_token_id: props.cardToken,
				preapproval_plan_id: props.externalPlanId,
			},
		});

		if (!response.id) {
			throw new InternalServerError(ErrorMessages.FAILED_TO_CREATE_SIGNATURE);
		}

		return { signatureId: response.id };
	}
}
