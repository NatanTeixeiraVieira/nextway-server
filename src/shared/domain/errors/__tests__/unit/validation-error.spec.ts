import { EntityValidationError, ValidationError } from '../../validation-error';

describe('ValidationError unit tests', () => {
	it('should create a ValidationError with default message', () => {
		const error = new ValidationError('Some error');
		expect(error).toBeInstanceOf(Error);
		expect(error).toBeInstanceOf(ValidationError);
		expect(error.message).toBe('Some error');
	});
});

describe('EntityValidationError unit tests', () => {
	it('should create an EntityValidationError with FieldsErrors', () => {
		const fieldsErrors = { field: ['error1', 'error2'] };
		const error = new EntityValidationError(fieldsErrors);
		expect(error).toBeInstanceOf(Error);
		expect(error).toBeInstanceOf(EntityValidationError);
		expect(error.message).toBe('Entity Validation Error');
		expect(error.name).toBe('EntityValidationError');
		expect(error.error).toBe(fieldsErrors);
	});

	it('should allow null as FieldsErrors', () => {
		const error = new EntityValidationError(null);
		expect(error.error).toBeNull();
	});
});
