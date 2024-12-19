import * as classValidator from 'class-validator';
import { ValidatorFields } from '../../validator-fields';

class StubValidatorFields extends ValidatorFields<{ field: string }> {}

describe('ValidatorFields unit tests', () => {
	beforeEach(() => {
		// Clear the mocks, for each it segment to the toHaveBeenCalledTimes work correctly
		jest.clearAllMocks();
	});

	it('should initialize errors and validatedData with null', () => {
		const sut = new StubValidatorFields();

		expect(sut.errors).toBeNull();
		expect(sut.validatedData).toBeNull();
	});

	it('should validate with errors', () => {
		const spyValidateSync = jest.spyOn(classValidator, 'validateSync');
		spyValidateSync.mockReturnValue([
			{ property: 'field', constraints: { isRequired: 'test error' } },
		]);

		const sut = new StubValidatorFields();

		expect(sut.validate(null)).toBeFalsy();
		expect(spyValidateSync).toHaveBeenCalledTimes(1);
		expect(sut.validatedData).toBeNull();
		expect(sut.errors).toStrictEqual({ field: ['test error'] });
	});

	it('should validate with errors', () => {
		const spyValidateSync = jest.spyOn(classValidator, 'validateSync');
		spyValidateSync.mockReturnValue([]);

		const sut = new StubValidatorFields();

		expect(sut.validate({ field: 'value' })).toBeTruthy();
		expect(spyValidateSync).toHaveBeenCalledTimes(1);
		expect(sut.validatedData).toStrictEqual({ field: 'value' });
		expect(sut.errors).toBeNull();
	});
});
