import { DeliveryProps } from '../../../entities/delivery.entity';
import {
	DeliveryRules,
	DeliveryValidator,
	DeliveryValidatorFactory,
} from '../../delivery.validator';

let sut: DeliveryValidator;
let props: DeliveryProps;

describe('DeliveryValidator unit tests', () => {
	beforeEach(() => {
		const deliveryValidatorFactory = new DeliveryValidatorFactory();
		sut = deliveryValidatorFactory.create();
		props = {
			deliveryRadiusKm: 5,
			deliveryPrice: 10.5,
		};
	});

	it('should test invalidation cases for deliveryRadiusKm field', () => {
		let isValid = sut.validate(null as any);
		expect(isValid).toBeFalsy();
		expect(sut.errors?.['deliveryRadiusKm']).toStrictEqual([
			'deliveryRadiusKm should not be empty',
			'deliveryRadiusKm must be a positive number',
		]);

		isValid = sut.validate({ ...props, deliveryRadiusKm: null as any });
		expect(isValid).toBeFalsy();
		expect(sut.errors?.['deliveryRadiusKm']).toContain(
			'deliveryRadiusKm should not be empty',
		);

		isValid = sut.validate({ ...props, deliveryRadiusKm: -1 });
		expect(isValid).toBeFalsy();
		expect(sut.errors?.['deliveryRadiusKm']).toContain(
			'deliveryRadiusKm must be a positive number',
		);

		isValid = sut.validate({ ...props, deliveryRadiusKm: 0 });
		expect(isValid).toBeFalsy();
		expect(sut.errors?.['deliveryRadiusKm']).toContain(
			'deliveryRadiusKm must be a positive number',
		);
	});

	it('should test invalidation cases for deliveryPrice field', () => {
		let isValid = sut.validate(null as any);
		expect(isValid).toBeFalsy();
		expect(sut.errors?.['deliveryPrice']).toStrictEqual([
			'deliveryPrice should not be empty',
			'deliveryPrice must be a positive number',
		]);

		isValid = sut.validate({ ...props, deliveryPrice: null as any });
		expect(isValid).toBeFalsy();
		expect(sut.errors?.['deliveryPrice']).toContain(
			'deliveryPrice should not be empty',
		);

		isValid = sut.validate({ ...props, deliveryPrice: -5 });
		expect(isValid).toBeFalsy();
		expect(sut.errors?.['deliveryPrice']).toContain(
			'deliveryPrice must be a positive number',
		);

		isValid = sut.validate({ ...props, deliveryPrice: 0 });
		expect(isValid).toBeFalsy();
		expect(sut.errors?.['deliveryPrice']).toContain(
			'deliveryPrice must be a positive number',
		);
	});

	it('should test valid cases for delivery rules', () => {
		const isValid = sut.validate(props);
		expect(isValid).toBeTruthy();
		expect(sut.validatedData).toStrictEqual(new DeliveryRules(props));
	});
});
