import {
	IsNotEmpty,
	IsString,
	MaxLength,
	ValidatorFields,
} from '@/shared/domain/validators/validator-fields';
import { WeekdayProps } from '../entities/weekday.entity';

export class WeekdayRules {
	@IsString()
	@IsNotEmpty()
	@MaxLength(255)
	id: string;

	@IsString()
	@IsNotEmpty()
	@MaxLength(255)
	name: string;

	@IsString()
	@IsNotEmpty()
	@MaxLength(255)
	shortName: string;

	constructor(props: WeekdayProps) {
		Object.assign(this, props);
	}
}

export class WeekdayValidator extends ValidatorFields<WeekdayRules> {
	validate(data: WeekdayProps | null): boolean {
		return super.validate(new WeekdayRules(data ?? ({} as WeekdayProps)));
	}
}

export class WeekdayValidatorFactory {
	create(): WeekdayValidator {
		return new WeekdayValidator();
	}
}
