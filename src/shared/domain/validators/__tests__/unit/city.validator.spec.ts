import { CityProps } from '@/shared/domain/entities/city.entity';
import {
	CityRules,
	CityValidator,
	CityValidatorFactory,
} from '../../city.validator';

let sut: CityValidator;
let props: CityProps;

describe('CityValidator unit tests', () => {
	beforeEach(() => {
		const cityValidatorFactory = new CityValidatorFactory();
		sut = cityValidatorFactory.create();
		props = {
			id: 'city-id-123',
			name: 'Curitiba',
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
			'name must be shorter than or equal to 255 characters',
			'name should not be empty',
			'name must be a string',
		]);

		isValid = sut.validate({ ...props, name: '' });
		expect(isValid).toBeFalsy();
		expect(sut.errors?.['name']).toStrictEqual(['name should not be empty']);

		isValid = sut.validate({ ...props, name: 10 as any });
		expect(isValid).toBeFalsy();
		expect(sut.errors?.['name']).toStrictEqual([
			'name must be shorter than or equal to 255 characters',
			'name must be a string',
		]);

		isValid = sut.validate({ ...props, name: 'a'.repeat(256) });
		expect(isValid).toBeFalsy();
		expect(sut.errors?.['name']).toStrictEqual([
			'name must be shorter than or equal to 255 characters',
		]);
	});

	it('should test valid cases for city rules', () => {
		const isValid = sut.validate(props);
		expect(isValid).toBeTruthy();
		expect(sut.validatedData).toStrictEqual(new CityRules(props));
	});
});
