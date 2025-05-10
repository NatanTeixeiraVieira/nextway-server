export type CreateSignatureProps = {
	externalPlanId: string;
	payerEmail: string;
	cardToken: string;
};

export type CreateSignatureResponse = {
	signatureId: string;
};

export interface PlanPaymentService {
	createSignature(
		props: CreateSignatureProps,
	): Promise<CreateSignatureResponse>;
}
