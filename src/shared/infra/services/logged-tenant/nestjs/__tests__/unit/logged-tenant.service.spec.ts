import { LoggedTenantNestjsService } from '../../logged-tenant.service';

describe('LoggedTenantNestjsService unit tests', () => {
	let sut: LoggedTenantNestjsService;

	beforeEach(() => {
		sut = new LoggedTenantNestjsService();
	});

	it('should set and get logged tenant', () => {
		const tenant = { id: 'tenant-id', email: 'tenant@email.com' };
		sut.setLoggedTenant(tenant);

		const result = sut.getLoggedTenant();
		expect(result).toEqual(tenant);
	});

	it('should return undefined if no tenant is set', () => {
		const result = sut.getLoggedTenant();
		expect(result).toBeUndefined();
	});
});
