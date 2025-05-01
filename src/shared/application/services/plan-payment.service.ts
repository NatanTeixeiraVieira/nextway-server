export type CreateSignatureProps = {
	externalPlanId: string;
	payerEmail: string;
	cardToken: string;
	backUrl: string;
	autoRecurring: {
		frequency: number;
		frequencyType: 'days' | 'months';
		transactionAmount: number;
		currency: string;
	};
};

export type CreateSignatureResponse = {
	signatureId: string;
};

export interface PlanPaymentService {
	createSignature(
		props: CreateSignatureProps,
	): Promise<CreateSignatureResponse>;
}
