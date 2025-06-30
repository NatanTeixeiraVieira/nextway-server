import { WeekdayValidator } from '../../weekday.validator';

describe('WeekdayValidator', () => {
	const validProps = {
		id: '73c7f9b5-6088-498c-a146-1b59e7c2360c',
		name: 'Segunda-feira',
		shortName: 'Seg',
	};

	it('should validate valid weekday props', () => {
		const validator = new WeekdayValidator();
		const isValid = validator.validate(validProps);
		expect(isValid).toBeTruthy();
		expect(validator.errors).toBeNull();
		expect(validator.validatedData).toEqual(
			expect.objectContaining(validProps),
		);
	});

	it('should invalidate when id is empty', () => {
		const validator = new WeekdayValidator();
		const isValid = validator.validate({ ...validProps, id: '' });
		expect(isValid).toBeFalsy();
		expect(validator.errors).toHaveProperty('id');
		expect(validator.errors?.id).toContain('id should not be empty');
	});

	it('should invalidate when id is not a string', () => {
		const validator = new WeekdayValidator();
		const isValid = validator.validate({ ...validProps, id: 123 as any });
		expect(isValid).toBeFalsy();
		expect(validator.errors).toHaveProperty('id');
		expect(validator.errors?.id).toContain('id must be a string');
	});

	it('should invalidate when id exceeds max length', () => {
		const validator = new WeekdayValidator();
		const longId = 'a'.repeat(256);
		const isValid = validator.validate({ ...validProps, id: longId });
		expect(isValid).toBeFalsy();
		expect(validator.errors).toHaveProperty('id');
		expect(validator.errors?.id).toContain(
			'id must be shorter than or equal to 255 characters',
		);
	});

	it('should invalidate when name is empty', () => {
		const validator = new WeekdayValidator();
		const isValid = validator.validate({ ...validProps, name: '' });
		expect(isValid).toBeFalsy();
		expect(validator.errors).toHaveProperty('name');
		expect(validator.errors?.name).toContain('name should not be empty');
	});

	it('should invalidate when name is not a string', () => {
		const validator = new WeekdayValidator();
		const isValid = validator.validate({ ...validProps, name: 123 as any });
		expect(isValid).toBeFalsy();
		expect(validator.errors).toHaveProperty('name');
		expect(validator.errors?.name).toContain('name must be a string');
	});

	it('should invalidate when name exceeds max length', () => {
		const validator = new WeekdayValidator();
		const longName = 'a'.repeat(256);
		const isValid = validator.validate({ ...validProps, name: longName });
		expect(isValid).toBeFalsy();
		expect(validator.errors).toHaveProperty('name');
		expect(validator.errors?.name).toContain(
			'name must be shorter than or equal to 255 characters',
		);
	});

	it('should invalidate when shortName is empty', () => {
		const validator = new WeekdayValidator();
		const isValid = validator.validate({ ...validProps, shortName: '' });
		expect(isValid).toBeFalsy();
		expect(validator.errors).toHaveProperty('shortName');
		expect(validator.errors?.shortName).toContain(
			'shortName should not be empty',
		);
	});

	it('should invalidate when shortName is not a string', () => {
		const validator = new WeekdayValidator();
		const isValid = validator.validate({
			...validProps,
			shortName: 123 as any,
		});
		expect(isValid).toBeFalsy();
		expect(validator.errors).toHaveProperty('shortName');
		expect(validator.errors?.shortName).toContain('shortName must be a string');
	});

	it('should invalidate when shortName exceeds max length', () => {
		const validator = new WeekdayValidator();
		const longShortName = 'a'.repeat(256);
		const isValid = validator.validate({
			...validProps,
			shortName: longShortName,
		});
		expect(isValid).toBeFalsy();
		expect(validator.errors).toHaveProperty('shortName');
		expect(validator.errors?.shortName).toContain(
			'shortName must be shorter than or equal to 255 characters',
		);
	});
});
