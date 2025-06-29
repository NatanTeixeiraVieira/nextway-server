import { EntityValidationError } from '@/shared/domain/errors/validation-error';
import { Regex } from '@/shared/domain/utils/regex';
import {
	IsNotEmpty,
	IsString,
	Matches,
	ValidatorFields,
} from '@/shared/domain/validators/validator-fields';
import { OpeningHoursProps } from '../entities/opening-hours';
import { WeekdayRules, WeekdayValidatorFactory } from './weekday.validator';

export class OpeningHoursRules {
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

	validateStartBeforeEnd(start: string, end: string) {
		const startMinutes = this.convertToMinutes(start);
		const endMinutes = this.convertToMinutes(end);

		if (startMinutes >= endMinutes) {
			throw new EntityValidationError({
				start: ['Start time must be before end time'],
				end: ['End time must be after start time'],
			});
		}
	}

	private convertToMinutes(time: string): number {
		const [hours, minutes] = time.split(':').map(Number);
		return hours * 60 + minutes;
	}
}

export class OpeningHoursValidator extends ValidatorFields<OpeningHoursRules> {
	validate(data: OpeningHoursProps | null): boolean {
		const isWeekdayValid = new WeekdayValidatorFactory()
			.create()
			.validate(data?.weekday ?? null);

		const openingHoursRules = new OpeningHoursRules(
			data ?? ({} as OpeningHoursProps),
		);

		const isValid = super.validate(openingHoursRules);

		if (isValid && data) {
			openingHoursRules.validateStartBeforeEnd(data.start, data.end);
		}

		return isValid;
	}
}

export class OpeningHoursValidatorFactory {
	create(): OpeningHoursValidator {
		return new OpeningHoursValidator();
	}
}
