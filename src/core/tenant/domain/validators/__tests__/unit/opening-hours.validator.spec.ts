import { OpeningHoursValidator } from '../../opening-hours.validator';

describe('OpeningHoursValidator', () => {
	const validProps = {
		weekday: {
			id: '1',
			name: 'Monday',
			shortName: 'Mon',
		},
		start: '08:00',
		end: '18:00',
	};

	it('should validate valid opening hours props', () => {
		const validator = new OpeningHoursValidator();
		const isValid = validator.validate(validProps);
		expect(isValid).toBeTruthy();
		expect(validator.errors).toBeNull();
		expect(validator.validatedData).toEqual(
			expect.objectContaining(validProps),
		);
	});

	it('should invalidate when weekday is missing', () => {
		const validator = new OpeningHoursValidator();
		const isValid = validator.validate({
			...validProps,
			weekday: undefined as any,
		});
		expect(isValid).toBeFalsy();
		expect(validator.errors).toHaveProperty('weekday');
	});

	it('should invalidate when start is missing', () => {
		const validator = new OpeningHoursValidator();
		const isValid = validator.validate({ ...validProps, start: '' });
		expect(isValid).toBeFalsy();
		expect(validator.errors?.start).toEqual(
			expect.arrayContaining([
				'start must match /^([01]\\d|2[0-3]):([0-5]\\d)$/ regular expression',
				'start should not be empty',
			]),
		);
	});

	it('should invalidate when end is missing', () => {
		const validator = new OpeningHoursValidator();
		const isValid = validator.validate({ ...validProps, end: '' });
		expect(isValid).toBeFalsy();
		expect(validator.errors?.end).toEqual(
			expect.arrayContaining([
				'end must match /^([01]\\d|2[0-3]):([0-5]\\d)$/ regular expression',
				'end should not be empty',
			]),
		);
	});

	it('should invalidate when start is not in HH:MM format', () => {
		const validator = new OpeningHoursValidator();
		const isValid = validator.validate({ ...validProps, start: '8am' });
		expect(isValid).toBeFalsy();
		expect(validator.errors?.start).toEqual(
			expect.arrayContaining([
				'start must match /^([01]\\d|2[0-3]):([0-5]\\d)$/ regular expression',
			]),
		);
	});

	it('should invalidate when end is not in HH:MM format', () => {
		const validator = new OpeningHoursValidator();
		const isValid = validator.validate({ ...validProps, end: '6pm' });
		expect(isValid).toBeFalsy();
		expect(validator.errors?.end).toEqual(
			expect.arrayContaining([
				'end must match /^([01]\\d|2[0-3]):([0-5]\\d)$/ regular expression',
			]),
		);
	});

	it('should invalidate when start is after or equal to end', () => {
		const validator = new OpeningHoursValidator();
		let isValid = validator.validate({
			...validProps,
			start: '18:00',
			end: '08:00',
		});
		expect(isValid).toBeFalsy();
		expect(validator.errors?.start).toEqual(
			expect.arrayContaining(['Start time must be before end time']),
		);
		expect(validator.errors?.end).toEqual(
			expect.arrayContaining(['End time must be after start time']),
		);

		isValid = validator.validate({
			...validProps,
			start: '10:00',
			end: '10:00',
		});
		expect(isValid).toBeFalsy();
		expect(validator.errors).toHaveProperty('start');
		expect(validator.errors).toHaveProperty('end');

		expect(validator.errors?.start).toEqual(
			expect.arrayContaining(['Start time must be before end time']),
		);
		expect(validator.errors?.end).toEqual(
			expect.arrayContaining(['End time must be after start time']),
		);
	});

	it('should flatten weekday errors', () => {
		const validator = new OpeningHoursValidator();
		const isValid = validator.validate({
			...validProps,
			weekday: { id: '', name: '', shortName: '' },
		});
		expect(isValid).toBeFalsy();

		expect(validator.errors?.['weekday.id'].length).toBeGreaterThanOrEqual(1);
		expect(validator.errors?.['weekday.name'].length).toBeGreaterThanOrEqual(1);
		expect(
			validator.errors?.['weekday.shortName'].length,
		).toBeGreaterThanOrEqual(1);
	});
});
