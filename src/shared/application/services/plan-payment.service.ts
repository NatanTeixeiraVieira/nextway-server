export type CreateSignatureProps = {
	planPrice: number;
	payerId: string;
	payerEmail: string;
};

export type CreateSignatureResponse = {
	initUrl: string;
};

export type PaymentInfos = Record<string, unknown>;

export type GrantFinishedPaymentProps = {
	payerId: string;
};

export type GrantFinishedPaymentResponse = {
	applicationPayerId: string;
	nextPaymentDate: Date;
};

export interface PlanPaymentService {
	createSignature(
		props: CreateSignatureProps,
	): Promise<CreateSignatureResponse>;

	isPaymentFinished(paymentInfos: PaymentInfos): boolean;

	grantFinishedPayment(
		props: GrantFinishedPaymentProps,
	): Promise<GrantFinishedPaymentResponse | null>;
}
