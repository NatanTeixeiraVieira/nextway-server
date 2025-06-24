import { mockTransactionTest } from '@/shared/infra/database/typeorm/decorators/testing/mock-transaction-test';
import { UnitOfWorkTypeOrm } from '../../unit-of-work-typeorm';

jest.mock(
	'@/shared/infra/database/typeorm/decorators/transactional.decorator',
	() => mockTransactionTest(),
);
describe('UnitOfWorkTypeOrm', () => {
	let sut: UnitOfWorkTypeOrm;

	beforeEach(() => {
		sut = new UnitOfWorkTypeOrm();
	});

	it('should execute the work and return its result', async () => {
		const work = jest.fn().mockResolvedValue('result');
		const result = await sut.execute(work);

		expect(work).toHaveBeenCalledTimes(1);
		expect(result).toBe('result');
	});
});
