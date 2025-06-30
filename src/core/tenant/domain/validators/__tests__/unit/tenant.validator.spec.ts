import { TenantDataBuilder } from '../../../testing/helpers/tenant-data-builder';
import { TenantValidator } from '../../tenant.validator';

describe('TenantValidator', () => {
	const validProps = TenantDataBuilder();

	it('should validate valid tenant props', () => {
		console.log('🚀 ~ describe ~ validProps:', validProps);
		const validator = new TenantValidator();
		const isValid = validator.validate(validProps);
		console.log('🚀 ~ it ~ validator.errors:', validator.errors);
		expect(isValid).toBeTruthy();
		expect(validator.errors).toBeNull();
		expect(validator.validatedData).toBeDefined();
	});

	it('should invalidate when responsibleName is empty', () => {
		const validator = new TenantValidator();
		const isValid = validator.validate({ ...validProps, responsibleName: '' });
		expect(isValid).toBeFalsy();
		expect(validator.errors?.responsibleName).toBeTruthy();
	});

	it('should invalidate when responsibleCpf is invalid', () => {
		const validator = new TenantValidator();
		const isValid = validator.validate({
			...validProps,
			responsibleCpf: '123',
		});
		expect(isValid).toBeFalsy();
		expect(validator.errors?.responsibleCpf).toBeTruthy();
	});

	it('should invalidate when email is invalid', () => {
		const validator = new TenantValidator();
		const isValid = validator.validate({
			...validProps,
			email: 'invalid-email',
		});
		expect(isValid).toBeFalsy();
		expect(validator.errors?.email).toBeTruthy();
	});

	it('should invalidate when password is empty', () => {
		const validator = new TenantValidator();
		const isValid = validator.validate({ ...validProps, password: '' });
		expect(isValid).toBeFalsy();
		expect(validator.errors?.password).toBeTruthy();
	});

	it('should invalidate when responsiblePhoneNumber is wrong length', () => {
		const validator = new TenantValidator();
		const isValid = validator.validate({
			...validProps,
			responsiblePhoneNumber: '123',
		});
		expect(isValid).toBeFalsy();
		expect(validator.errors?.responsiblePhoneNumber).toBeTruthy();
	});

	it('should invalidate when slug has spaces', () => {
		const validator = new TenantValidator();
		const isValid = validator.validate({ ...validProps, slug: 'invalid slug' });
		expect(isValid).toBeFalsy();
		expect(validator.errors?.slug).toBeTruthy();
	});

	it('should invalidate when state is invalid', () => {
		const validator = new TenantValidator();
		const isValid = validator.validate({
			...validProps,
			state: { id: '', name: '', uf: '' },
		});
		expect(isValid).toBeFalsy();
		expect(validator.errors?.['state.id']).toBeTruthy();
		expect(validator.errors?.['state.name']).toBeTruthy();
		expect(validator.errors?.['state.uf']).toBeTruthy();
	});

	it('should invalidate when city is invalid', () => {
		const validator = new TenantValidator();
		const isValid = validator.validate({
			...validProps,
			city: { id: '', name: '' },
		});
		expect(isValid).toBeFalsy();
		expect(validator.errors?.['city.id']).toBeTruthy();
		expect(validator.errors?.['city.name']).toBeTruthy();
	});

	it('should invalidate when neighborhood is empty', () => {
		const validator = new TenantValidator();
		const isValid = validator.validate({ ...validProps, neighborhood: '' });
		expect(isValid).toBeFalsy();
		expect(validator.errors?.neighborhood).toBeTruthy();
	});

	it('should invalidate when street is empty', () => {
		const validator = new TenantValidator();
		const isValid = validator.validate({ ...validProps, street: '' });
		expect(isValid).toBeFalsy();
		expect(validator.errors?.street).toBeTruthy();
	});

	it('should invalidate when streetNumber is empty', () => {
		const validator = new TenantValidator();
		const isValid = validator.validate({ ...validProps, streetNumber: '' });
		expect(isValid).toBeFalsy();
		expect(validator.errors?.streetNumber).toBeTruthy();
	});

	it('should invalidate when zipcode is empty', () => {
		const validator = new TenantValidator();
		const isValid = validator.validate({ ...validProps, zipcode: '' });
		expect(isValid).toBeFalsy();
		expect(validator.errors?.zipcode).toBeTruthy();
	});

	it('should invalidate when mainColor is empty', () => {
		const validator = new TenantValidator();
		const isValid = validator.validate({ ...validProps, mainColor: '' });
		expect(isValid).toBeFalsy();
		expect(validator.errors?.mainColor).toBeTruthy();
	});

	it('should invalidate when establishmentName is empty', () => {
		const validator = new TenantValidator();
		const isValid = validator.validate({
			...validProps,
			establishmentName: '',
		});
		expect(isValid).toBeFalsy();
		expect(validator.errors?.establishmentName).toBeTruthy();
	});

	it('should invalidate when establishmentPhoneNumber is wrong length', () => {
		const validator = new TenantValidator();
		const isValid = validator.validate({
			...validProps,
			establishmentPhoneNumber: '123',
		});
		expect(isValid).toBeFalsy();
		expect(validator.errors?.establishmentPhoneNumber).toBeTruthy();
	});

	it('should invalidate when longitude is not a number', () => {
		const validator = new TenantValidator();
		const isValid = validator.validate({
			...validProps,
			longitude: 'not-a-number' as any,
		});
		expect(isValid).toBeFalsy();
		expect(validator.errors?.longitude).toBeTruthy();
	});

	it('should invalidate when latitude is not a number', () => {
		const validator = new TenantValidator();
		const isValid = validator.validate({
			...validProps,
			latitude: 'not-a-number' as any,
		});
		expect(isValid).toBeFalsy();
		expect(validator.errors?.latitude).toBeTruthy();
	});

	it('should invalidate when cnpj is invalid', () => {
		const validator = new TenantValidator();
		const isValid = validator.validate({ ...validProps, cnpj: '123' });
		expect(isValid).toBeFalsy();
		expect(validator.errors?.cnpj).toBeTruthy();
	});

	it('should invalidate when corporateReason is empty', () => {
		const validator = new TenantValidator();
		const isValid = validator.validate({ ...validProps, corporateReason: '' });
		expect(isValid).toBeFalsy();
		expect(validator.errors?.corporateReason).toBeTruthy();
	});

	it('should invalidate when coverImagePath exceeds max length', () => {
		const validator = new TenantValidator();
		const isValid = validator.validate({
			...validProps,
			coverImagePath: 'a'.repeat(256),
		});
		expect(isValid).toBeFalsy();
		expect(validator.errors?.coverImagePath).toBeTruthy();
	});

	it('should invalidate when logoImagePath exceeds max length', () => {
		const validator = new TenantValidator();
		const isValid = validator.validate({
			...validProps,
			logoImagePath: 'a'.repeat(256),
		});
		expect(isValid).toBeFalsy();
		expect(validator.errors?.logoImagePath).toBeTruthy();
	});

	it('should invalidate when description exceeds max length', () => {
		const validator = new TenantValidator();
		const isValid = validator.validate({
			...validProps,
			description: 'a'.repeat(1001),
		});
		expect(isValid).toBeFalsy();
		expect(validator.errors?.description).toBeTruthy();
	});

	it('should invalidate when deliveries are invalid', () => {
		const validator = new TenantValidator();
		const isValid = validator.validate({
			...validProps,
			deliveries: [{ deliveryRadiusKm: -1, deliveryPrice: 0 }],
		});
		expect(isValid).toBeFalsy();
		expect(validator.errors?.['deliveries.0.deliveryRadiusKm']).toBeTruthy();
		expect(validator.errors?.['deliveries.0.deliveryPrice']).toBeTruthy();
	});

	it('should invalidate when banners are invalid', () => {
		const validator = new TenantValidator();
		const isValid = validator.validate({
			...validProps,
			banners: [{ imagePath: '', active: null as any }],
		});
		expect(isValid).toBeFalsy();
		expect(validator.errors?.['banners.0.imagePath']).toBeTruthy();
		expect(validator.errors?.['banners.0.active']).toBeTruthy();
	});

	it('should invalidate when openingHours are invalid', () => {
		const validator = new TenantValidator();
		const isValid = validator.validate({
			...validProps,
			openingHours: [
				{
					weekday: { id: '', name: '', shortName: '' },
					start: '',
					end: '',
				},
			],
		});
		expect(isValid).toBeFalsy();
		expect(validator.errors?.['openingHours.0.weekday.id']).toBeTruthy();
		expect(validator.errors?.['openingHours.0.weekday.name']).toBeTruthy();
		expect(validator.errors?.['openingHours.0.weekday.shortName']).toBeTruthy();
		expect(validator.errors?.['openingHours.0.start']).toBeTruthy();
		expect(validator.errors?.['openingHours.0.end']).toBeTruthy();
	});

	it('should invalidate when plan is invalid', () => {
		const validator = new TenantValidator();
		const isValid = validator.validate({
			...validProps,
			plan: { id: '', name: '', price: -1, externalId: '' },
		});
		expect(isValid).toBeFalsy();
		expect(validator.errors?.['plan.id']).toBeTruthy();
		expect(validator.errors?.['plan.name']).toBeTruthy();
		expect(validator.errors?.['plan.price']).toBeTruthy();
		expect(validator.errors?.['plan.externalId']).toBeTruthy();
	});

	it('should invalidate when payerDocumentType is invalid', () => {
		const validator = new TenantValidator();
		const isValid = validator.validate({
			...validProps,
			payerDocumentType: 'INVALID' as any,
		});
		expect(isValid).toBeFalsy();
		expect(validator.errors?.payerDocumentType).toBeTruthy();
	});

	it('should invalidate when payerEmail is invalid', () => {
		const validator = new TenantValidator();
		const isValid = validator.validate({
			...validProps,
			payerEmail: 'not-an-email',
		});
		expect(isValid).toBeFalsy();
		expect(validator.errors?.payerEmail).toBeTruthy();
	});

	it('should invalidate when nextDueDate is not a date', () => {
		const validator = new TenantValidator();
		const isValid = validator.validate({
			...validProps,
			nextDueDate: 'not-a-date' as any,
		});
		expect(isValid).toBeFalsy();
		expect(validator.errors?.nextDueDate).toBeTruthy();
	});
});
