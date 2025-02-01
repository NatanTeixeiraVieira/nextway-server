import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';
import { ValidatorFields } from '../../validator-fields';

class StubRules {
	@MaxLength(255)
	@IsString()
	@IsNotEmpty()
	name: string;

	@IsNumber()
	@IsNotEmpty()
	price: number;

	constructor(data: object) {
		Object.assign(this, data);
	}
}

class StubValidatorFields extends ValidatorFields<StubRules> {
	validate(data: StubRules | null): boolean {
		return super.validate(new StubRules(data ?? {}));
	}
}

describe('ValidatorFields integration tests', () => {
	it('should validate with errors', () => {
		const sut = new StubValidatorFields();

		expect(sut.validate(null)).toBeFalsy();
		expect(sut.errors).toStrictEqual({
			name: [
				'name should not be empty',
				'name must be a string',
				'name must be shorter than or equal to 255 characters',
			],
			price: [
				'price should not be empty',
				'price must be a number conforming to the specified constraints',
			],
		});
	});

	it('should validate with name property with errors', () => {
		const sut = new StubValidatorFields();

		expect(
			sut.validate({ name: 10, price: 50 } as unknown as StubRules),
		).toBeFalsy();
		expect(sut.errors).toStrictEqual({
			name: [
				'name must be a string',
				'name must be shorter than or equal to 255 characters',
			],
		});
	});

	it('should validate with price property with errors', () => {
		const sut = new StubValidatorFields();

		expect(
			sut.validate({ name: 'Test', price: '50' } as unknown as StubRules),
		).toBeFalsy();
		expect(sut.errors).toStrictEqual({
			price: ['price must be a number conforming to the specified constraints'],
		});
	});

	it('should validate without errors', () => {
		const sut = new StubValidatorFields();

		expect(sut.validate({ name: 'value', price: 10 })).toBeTruthy();
		expect(sut.validatedData).toStrictEqual(
			new StubRules({ name: 'value', price: 10 }),
		);
	});
});
