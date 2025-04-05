import {
	IsNotEmpty,
	IsString,
	MaxLength,
	ValidatorFields,
} from '@/shared/domain/validators/validator-fields';
import { CityProps } from '../entities/city.entity';

export class CityRules {
	@IsString()
	@IsNotEmpty()
	@MaxLength(255)
	id: string;

	@IsString()
	@IsNotEmpty()
	@MaxLength(255)
	name: string;

	constructor(props: CityProps) {
		Object.assign(this, props);
	}
}

export class CityValidator extends ValidatorFields<CityRules> {
	validate(data: CityProps | null): boolean {
		return super.validate(new CityRules(data ?? ({} as CityProps)));
	}
}

export class CityValidatorFactory {
	create(): CityValidator {
		return new CityValidator();
	}
}
