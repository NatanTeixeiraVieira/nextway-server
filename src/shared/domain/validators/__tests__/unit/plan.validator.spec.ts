import { PlanProps } from '@/shared/domain/entities/plan.entity';
import {
	PlanRules,
	PlanValidator,
	PlanValidatorFactory,
} from '../../plan.validator';

let sut: PlanValidator;
let props: PlanProps;

describe('PlanValidator unit tests', () => {
	beforeEach(() => {
		const planValidatorFactory = new PlanValidatorFactory();
		sut = planValidatorFactory.create();
		props = {
			id: 'plan-id-123',
			name: 'Basic Plan',
			externalId: 'external-123',
			price: 99.99,
		};
	});

	it('should test invalidation cases for id field', () => {
		let isValid = sut.validate(null as any);
		expect(isValid).toBeFalsy();
		expect(sut.errors?.['id']).toStrictEqual([
			'id must be shorter than or equal to 255 characters',
			'id should not be empty',
			'id must be a string',
		]);

		isValid = sut.validate({ ...props, id: '' });
		expect(isValid).toBeFalsy();
		expect(sut.errors?.['id']).toStrictEqual(['id should not be empty']);

		isValid = sut.validate({ ...props, id: 10 as any });
		expect(isValid).toBeFalsy();
		expect(sut.errors?.['id']).toStrictEqual([
			'id must be shorter than or equal to 255 characters',
			'id must be a string',
		]);

		isValid = sut.validate({ ...props, id: 'a'.repeat(256) });
		expect(isValid).toBeFalsy();
		expect(sut.errors?.['id']).toStrictEqual([
			'id must be shorter than or equal to 255 characters',
		]);
	});

	it('should test invalidation cases for name field', () => {
		let isValid = sut.validate(null as any);
		expect(isValid).toBeFalsy();
		expect(sut.errors?.['name']).toStrictEqual([
			'name must be shorter than or equal to 30 characters',
			'name should not be empty',
			'name must be a string',
		]);

		isValid = sut.validate({ ...props, name: '' });
		expect(isValid).toBeFalsy();
		expect(sut.errors?.['name']).toStrictEqual(['name should not be empty']);

		isValid = sut.validate({ ...props, name: 10 as any });
		expect(isValid).toBeFalsy();
		expect(sut.errors?.['name']).toStrictEqual([
			'name must be shorter than or equal to 30 characters',
			'name must be a string',
		]);

		isValid = sut.validate({ ...props, name: 'a'.repeat(256) });
		expect(isValid).toBeFalsy();
		expect(sut.errors?.['name']).toStrictEqual([
			'name must be shorter than or equal to 30 characters',
		]);
	});

	it('should test invalidation cases for externalId field', () => {
		let isValid = sut.validate(null as any);
		expect(isValid).toBeFalsy();
		expect(sut.errors?.['externalId']).toStrictEqual([
			'externalId must be shorter than or equal to 255 characters',
			'externalId should not be empty',
			'externalId must be a string',
		]);

		isValid = sut.validate({ ...props, externalId: '' });
		expect(isValid).toBeFalsy();
		expect(sut.errors?.['externalId']).toStrictEqual([
			'externalId should not be empty',
		]);

		isValid = sut.validate({ ...props, externalId: 10 as any });
		expect(isValid).toBeFalsy();
		expect(sut.errors?.['externalId']).toStrictEqual([
			'externalId must be shorter than or equal to 255 characters',
			'externalId must be a string',
		]);

		isValid = sut.validate({ ...props, externalId: 'a'.repeat(256) });
		expect(isValid).toBeFalsy();
		expect(sut.errors?.['externalId']).toStrictEqual([
			'externalId must be shorter than or equal to 255 characters',
		]);
	});

	it('should test invalidation cases for price field', () => {
		let isValid = sut.validate(null as any);
		expect(isValid).toBeFalsy();
		expect(sut.errors?.['price']).toStrictEqual([
			'price must be a positive number',
			'price must be a number conforming to the specified constraints',
		]);

		isValid = sut.validate({ ...props, price: null as any });
		expect(isValid).toBeFalsy();
		expect(sut.errors?.['price']).toStrictEqual([
			'price must be a positive number',
			'price must be a number conforming to the specified constraints',
		]);

		isValid = sut.validate({ ...props, price: 'not-a-number' as any });
		expect(isValid).toBeFalsy();
		expect(sut.errors?.['price']).toStrictEqual([
			'price must be a positive number',
			'price must be a number conforming to the specified constraints',
		]);
	});

	it('should test valid cases for plan rules', () => {
		const isValid = sut.validate(props);
		expect(isValid).toBeTruthy();
		expect(sut.validatedData).toStrictEqual(new PlanRules(props));
	});
});
