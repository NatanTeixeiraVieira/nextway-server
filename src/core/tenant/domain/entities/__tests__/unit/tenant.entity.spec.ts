import {
	RegisterTenantProps,
	Tenant,
} from '@/core/tenant/domain/entities/tenant.entity';
import { TenantDataBuilder } from '@/core/tenant/domain/testing/helpers/tenant-data-builder';
import { TenantValidatorFactory } from '@/core/tenant/domain/validators/tenant.validator';
import { EntityValidationError } from '@/shared/domain/errors/validation-error';

// Mock the validator to always pass validation
jest.mock('@/core/tenant/domain/validators/tenant.validator.ts', () => ({
	TenantValidatorFactory: jest.fn().mockImplementation(() => ({
		create: () => ({
			validate: () => true,
			errors: [],
		}),
	})),
}));
describe('Tenant Entity', () => {
	let baseProps: RegisterTenantProps;

	beforeEach(() => {
		const data = TenantDataBuilder();
		baseProps = {
			responsibleName: data.responsibleName,
			responsibleCpf: data.responsibleCpf,
			email: data.email,
			responsiblePhoneNumber: data.responsiblePhoneNumber,
			zipcode: data.zipcode,
			state: data.state,
			city: data.city,
			neighborhood: data.neighborhood,
			street: data.street,
			streetNumber: data.streetNumber,
			longitude: data.longitude,
			latitude: data.latitude,
			cnpj: data.cnpj,
			corporateReason: data.corporateReason,
			establishmentName: data.establishmentName,
			establishmentPhoneNumber: data.establishmentPhoneNumber,
			slug: data.slug,
			password: data.password,
			verifyEmailCode: 'IJKLMN',
			plan: data.plan,
		};
		jest.clearAllMocks();
	});

	it('should register a tenant with valid props', () => {
		const validateSpy = jest.spyOn(Tenant as any, 'validate');
		const tenant = Tenant.registerTenant(baseProps);
		expect(tenant).toBeInstanceOf(Tenant);
		expect(validateSpy).toHaveBeenCalledTimes(1);

		expect(tenant.props.id).toBeTruthy();
		expect(tenant.props.email).toBe(baseProps.email);
		expect(tenant.props.active).toBe(false);
		expect(tenant.props.emailVerified).toBeNull();
		expect(tenant.props.verifyEmailCode).toBe(baseProps.verifyEmailCode);
		expect(tenant.props.coverImagePath).toBeNull();
		expect(tenant.props.logoImagePath).toBeNull();
		expect(tenant.props.description).toBeNull();
		expect(tenant.props.forgotPasswordEmailVerificationToken).toBeNull();
		expect(tenant.props.payerDocument).toBeNull();
		expect(tenant.props.payerDocumentType).toBeNull();
		expect(tenant.props.payerEmail).toBeNull();
		expect(tenant.props.payerName).toBeNull();
		expect(tenant.props.nextDueDate).toBeNull();
	});

	it('should throw EntityValidationError if validation fails', () => {
		// Override mock to fail validation
		(TenantValidatorFactory as any).mockImplementationOnce(() => ({
			create: () => ({
				validate: () => false,
				errors: {
					email: ['Invalid data'],
				},
			}),
		}));

		expect(() => Tenant.registerTenant(baseProps)).toThrow(
			EntityValidationError,
		);
	});

	it('should verify email and clear verifyEmailCode', () => {
		const tenant = Tenant.registerTenant(baseProps);
		tenant.checkEmail();
		expect(tenant.emailVerified).toBeInstanceOf(Date);
		expect(tenant.verifyEmailCode).toBeNull();
	});

	it('should activate account and set nextDueDate and active', () => {
		const tenant = Tenant.registerTenant(baseProps);
		const nextDueDate = new Date();
		tenant.activateAccount({ nextDueDate });
		expect(tenant.nextDueDate).toBe(nextDueDate);
		expect(tenant.active).toBe(true);
	});

	it('should mark tenant as deleted', () => {
		const tenant = Tenant.registerTenant(baseProps);
		// markAsDeleted and updateTimestamp are protected in Entity, so we check deletedAt
		tenant.deleteAccount();
		expect(tenant.props.audit.deletedAt).toBeInstanceOf(Date);
		expect(tenant.props.audit.updatedAt).toBeInstanceOf(Date);
	});
});
