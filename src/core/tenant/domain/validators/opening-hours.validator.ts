import { Regex } from '@/shared/domain/utils/regex';
import {
	IsNotEmpty,
	IsString,
	Matches,
	ValidateNested,
	ValidatorFields,
} from '@/shared/domain/validators/validator-fields';
import { Type } from 'class-transformer';
import { OpeningHoursProps } from '../entities/opening-hours';
import { WeekdayRules, WeekdayValidatorFactory } from './weekday.validator';

export class OpeningHoursRules {
	@ValidateNested()
	@Type(() => WeekdayRules)
	@IsNotEmpty()
	weekday: WeekdayRules;

	@IsString()
	@IsNotEmpty()
	@Matches(Regex.TIME_HHMM_FORMAT)
	start: string;

	@IsString()
	@IsNotEmpty()
	@Matches(Regex.TIME_HHMM_FORMAT)
	end: string;

	constructor(props: OpeningHoursProps) {
		Object.assign(this, props);
	}
}

export class OpeningHoursValidator extends ValidatorFields<OpeningHoursRules> {
	validate(data: OpeningHoursProps | null): boolean {
		const weekdayRules = new WeekdayValidatorFactory().create();

		const isWeekdayValid = weekdayRules.validate(data?.weekday ?? null);

		const openingHoursRules = new OpeningHoursRules(
			data ?? ({} as OpeningHoursProps),
		);

		const isValid = super.validate(openingHoursRules);

		if (isValid && data) {
			this.validateStartBeforeEnd(data.start, data.end);
		}

		if (weekdayRules.errors) {
			this.flattenErrors('weekday', weekdayRules.errors);
		}

		return isValid && isWeekdayValid && !this.errors;
	}

	private validateStartBeforeEnd(start: string, end: string) {
		const startMinutes = this.convertToMinutes(start);
		const endMinutes = this.convertToMinutes(end);

		if (startMinutes >= endMinutes) {
			this.errors = {
				...this.errors,
				start: ['Start time must be before end time'],
				end: ['End time must be after start time'],
			};
		}
	}

	private convertToMinutes(time: string): number {
		const [hours, minutes] = time.split(':').map(Number);
		return hours * 60 + minutes;
	}
}

export class OpeningHoursValidatorFactory {
	create(): OpeningHoursValidator {
		return new OpeningHoursValidator();
	}
}
