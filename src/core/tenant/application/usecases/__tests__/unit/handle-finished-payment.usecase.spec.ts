import { TenantRepository } from '@/core/tenant/domain/repositories/tenant.repository';
import { ErrorMessages } from '@/shared/application/error-messages/error-messages';
import { NotFoundError } from '@/shared/application/errors/not-found-error';
import { handleFinishedPaymentUseCase } from '../../handle-finished-payment.usecase';

describe('HandleFinishedPaymentUseCase unit tests', () => {
	let sut: handleFinishedPaymentUseCase;
	let tenantRepository: TenantRepository;
	let tenant: any;

	const input = {
		nextDueDate: new Date('2025-07-14T00:00:00Z'),
		tenantId: 'tenant-id-123',
	};

	beforeEach(() => {
		tenant = {
			activateAccount: jest.fn(),
		};
		tenantRepository = {
			getById: jest.fn().mockResolvedValue(tenant),
			update: jest.fn().mockResolvedValue(undefined),
		} as any;

		sut = new handleFinishedPaymentUseCase(tenantRepository);
	});

	it('should activate account and update tenant when tenant exists', async () => {
		await sut.execute(input);

		expect(tenantRepository.getById).toHaveBeenCalledWith(input.tenantId);
		expect(tenant.activateAccount).toHaveBeenCalledWith({
			nextDueDate: new Date(input.nextDueDate),
		});
		expect(tenantRepository.update).toHaveBeenCalledWith(tenant);
	});

	it('should throw NotFoundError when tenant does not exist', async () => {
		(tenantRepository.getById as jest.Mock).mockResolvedValue(null);

		await expect(sut.execute(input)).rejects.toThrow(
			new NotFoundError(ErrorMessages.tenantNotFoundById(input.tenantId)),
		);
	});
});
