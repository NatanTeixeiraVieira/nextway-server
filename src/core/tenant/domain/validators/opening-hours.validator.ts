import { EntityValidationError } from '@/shared/domain/errors/validation-error';
import { Regex } from '@/shared/domain/utils/regex';
import {
	IsNotEmpty,
	IsString,
	Matches,
	ValidatorFields,
} from '@/shared/domain/validators/validator-fields';
import { OpeningHoursProps } from '../entities/opening-hours';
import { WeekdayRules } from './weekday.validator';

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
		this.validateStartBeforeEnd(props.start, props.end);
		Object.assign(this, props);
	}

	private validateStartBeforeEnd(start: string, end: string) {
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
		return super.validate(
			new OpeningHoursRules(data ?? ({} as OpeningHoursProps)),
		);
	}
}

export class OpeningHoursValidatorFactory {
	create(): OpeningHoursValidator {
		return new OpeningHoursValidator();
	}
}
