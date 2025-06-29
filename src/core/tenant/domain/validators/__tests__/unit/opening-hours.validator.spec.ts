import { EntityValidationError } from '@/shared/domain/errors/validation-error';
import { OpeningHoursProps } from '../../../entities/opening-hours';
import {
	OpeningHoursRules,
	OpeningHoursValidator,
	OpeningHoursValidatorFactory,
} from '../../opening-hours.validator';

describe('OpeningHoursValidator unit tests', () => {
	let sut: OpeningHoursValidator;
	let props: OpeningHoursProps;
	beforeEach(() => {
		const factory = new OpeningHoursValidatorFactory();
		sut = factory.create();
		props = {
			weekday: {
				id: 'cb535055-fff7-48f2-9de7-1445d37e612c',
				name: 'Segunda-feira',
				shortName: 'seg',
			}, // adjust as needed for your WeekdayRules
			start: '08:00',
			end: '18:00',
		};
	});

	it('should test invalidation cases for weekday field', () => {
		let isValid = sut.validate(null as any);
		expect(isValid).toBeFalsy();
		console.log('🚀 ~ it ~ sut.errors?.weekday:', sut.errors);
		expect(sut.errors?.weekday).toBeDefined();

		// isValid = sut.validate({ ...props, weekday: null as any });
		// expect(isValid).toBeFalsy();
		// expect(sut.errors?.weekday).toBeDefined();

		// isValid = sut.validate({ ...props, weekday: { value: 8 } as any });
		// console.log('🚀 ~ it ~ sut.errors?.weekday:', sut.errors?.weekday);
		// expect(isValid).toBeFalsy();
		// expect(sut.errors?.weekday).toBeDefined();
	});

	it('should test invalidation cases for start field', () => {
		let isValid = sut.validate({ ...props, start: '' });
		expect(isValid).toBeFalsy();
		expect(sut.errors?.start).toContain('start should not be empty');

		isValid = sut.validate({ ...props, start: 123 as any });
		expect(isValid).toBeFalsy();
		expect(sut.errors?.start).toContain('start must be a string');

		isValid = sut.validate({ ...props, start: '25:00' });
		expect(isValid).toBeFalsy();
		expect(sut.errors?.start).toContain(
			'start must match /^([01]\\d|2[0-3]):([0-5]\\d)$/ regular expression',
		);
	});

	it('should test invalidation cases for end field', () => {
		let isValid = sut.validate({ ...props, end: '' });
		expect(isValid).toBeFalsy();
		expect(sut.errors?.end).toContain('end should not be empty');

		isValid = sut.validate({ ...props, end: 123 as any });
		expect(isValid).toBeFalsy();
		expect(sut.errors?.end).toContain('end must be a string');

		isValid = sut.validate({ ...props, end: '25:00' });
		expect(isValid).toBeFalsy();
		expect(sut.errors?.end).toContain(
			'end must match /^([01]\\d|2[0-3]):([0-5]\\d)$/ regular expression',
		);
	});

	it('should throw EntityValidationError if start is not before end', () => {
		expect(() =>
			sut.validate({ ...props, start: '10:00', end: '09:00' }),
		).toThrow(EntityValidationError);

		expect(() =>
			sut.validate({ ...props, start: '10:00', end: '10:00' }),
		).toThrow(EntityValidationError);
	});

	it('should test valid cases for opening hours rules', () => {
		const isValid = sut.validate(props);
		expect(isValid).toBeTruthy();
		expect(sut.validatedData).toStrictEqual(new OpeningHoursRules(props));
	});
});
