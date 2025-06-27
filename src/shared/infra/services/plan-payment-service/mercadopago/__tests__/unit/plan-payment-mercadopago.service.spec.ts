import { ErrorMessages } from '@/shared/application/error-messages/error-messages';
import { InternalServerError } from '@/shared/application/errors/internal-server-error';
import { PlanPaymentMercadopagoService } from '../../plan-payment-mercadopago.service';

jest.mock('PlanPaymentMercadopagoService unit tests', () => {
	const PreApproval = jest.fn().mockImplementation(() => ({
		create: jest.fn(),
		get: jest.fn(),
	}));
	const MercadoPagoConfig = jest.fn();
	return {
		__esModule: true,
		default: MercadoPagoConfig, // <-- default export
		PreApproval,
		MercadoPagoConfig,
	};
});

describe('PlanPaymentMercadopagoService', () => {
	let sut: PlanPaymentMercadopagoService;
	let envConfigService: any;
	let preApprovalMock: any;

	beforeEach(() => {
		preApprovalMock = {
			create: jest.fn(),
			get: jest.fn(),
		};

		const PreApproval = require('mercadopago').PreApproval;

		// Mock PreApproval to always return our mock
		PreApproval.mockImplementation(() => preApprovalMock);

		envConfigService = {
			getPaymentAccessToken: jest.fn().mockReturnValue('access-token'),
			getPaymentRedirectUrl: jest.fn().mockReturnValue('http://redirect.url'),
			getNodeEnv: jest.fn().mockReturnValue('production'),
			getPaymentTestPayerEmail: jest.fn().mockReturnValue('test@email.com'),
		};

		sut = new PlanPaymentMercadopagoService(envConfigService);
	});

	describe('createSignature', () => {
		it('should call preApproval.create and return initUrl', async () => {
			const props = {
				payerEmail: 'payer@email.com',
				planPrice: 100,
				payerId: 'payer-id',
			};
			const mockResponse = {
				id: 'preapproval-id',
				init_point: 'http://init.url',
			};
			preApprovalMock.create.mockResolvedValue(mockResponse);

			const result = await sut.createSignature(props);

			expect(envConfigService.getPaymentRedirectUrl).toHaveBeenCalled();
			expect(preApprovalMock.create).toHaveBeenCalledWith({
				body: {
					payer_email: props.payerEmail,
					auto_recurring: {
						frequency: 1,
						frequency_type: 'months',
						transaction_amount: props.planPrice,
						currency_id: 'BRL',
					},
					reason: 'Subscription',
					status: 'pending',
					external_reference: props.payerId,
					back_url: 'http://redirect.url',
				},
			});
			expect(result).toEqual({ initUrl: 'http://init.url' });
		});

		it('should use test payer email if not in production', async () => {
			envConfigService.getNodeEnv.mockReturnValue('development');
			const props = {
				payerEmail: 'payer@email.com',
				planPrice: 100,
				payerId: 'payer-id',
			};
			const mockResponse = {
				id: 'preapproval-id',
				init_point: 'http://init.url',
			};
			preApprovalMock.create.mockResolvedValue(mockResponse);

			const result = await sut.createSignature(props);

			expect(envConfigService.getPaymentTestPayerEmail).toHaveBeenCalled();
			expect(preApprovalMock.create).toHaveBeenCalledWith(
				expect.objectContaining({
					body: expect.objectContaining({
						payer_email: 'test@email.com',
					}),
				}),
			);
			expect(result).toEqual({ initUrl: 'http://init.url' });
		});

		it('should throw InternalServerError if response is missing id or init_point', async () => {
			const props = {
				payerEmail: 'payer@email.com',
				planPrice: 100,
				payerId: 'payer-id',
			};
			preApprovalMock.create.mockResolvedValue({ id: null, init_point: null });

			await expect(sut.createSignature(props)).rejects.toThrow(
				new InternalServerError(ErrorMessages.FAILED_TO_CREATE_SIGNATURE),
			);
		});
	});

	describe('isPaymentFinished', () => {
		it('should return true if action is "updated" and entity is "preapproval"', () => {
			const paymentInfos = { action: 'updated', entity: 'preapproval' };
			expect(sut.isPaymentFinished(paymentInfos)).toBe(true);
		});

		it('should return false otherwise', () => {
			expect(
				sut.isPaymentFinished({ action: 'created', entity: 'preapproval' }),
			).toBe(false);
			expect(
				sut.isPaymentFinished({ action: 'updated', entity: 'other' }),
			).toBe(false);
		});
	});

	describe('grantFinishedPayment', () => {
		it('should return null if response is missing required fields', async () => {
			preApprovalMock.get.mockResolvedValue({
				external_reference: null,
				status: 'authorized',
				next_payment_date: '2024-01-01T00:00:00Z',
			});
			const result = await sut.grantFinishedPayment({ payerId: 'payer-id' });
			expect(result).toBeNull();

			preApprovalMock.get.mockResolvedValue({
				external_reference: 'ref',
				status: 'pending',
				next_payment_date: '2024-01-01T00:00:00Z',
			});
			const result2 = await sut.grantFinishedPayment({ payerId: 'payer-id' });
			expect(result2).toBeNull();

			preApprovalMock.get.mockResolvedValue({
				external_reference: 'ref',
				status: 'authorized',
				next_payment_date: null,
			});
			const result3 = await sut.grantFinishedPayment({ payerId: 'payer-id' });
			expect(result3).toBeNull();
		});

		it('should return applicationPayerId and nextPaymentDate if response is valid', async () => {
			const mockDate = '2024-01-01T00:00:00Z';
			preApprovalMock.get.mockResolvedValue({
				external_reference: 'ref',
				status: 'authorized',
				next_payment_date: mockDate,
			});
			const result = await sut.grantFinishedPayment({ payerId: 'payer-id' });
			expect(result).toEqual({
				applicationPayerId: 'ref',
				nextPaymentDate: new Date(mockDate),
			});
		});
	});
});
