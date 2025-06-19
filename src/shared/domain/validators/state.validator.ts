import {
	IsNotEmpty,
	IsString,
	MaxLength,
	ValidatorFields,
} from '@/shared/domain/validators/validator-fields';
import { StateProps } from '../entities/state.entity';

export class StateRules {
	@IsString()
	@IsNotEmpty()
	@MaxLength(255)
	id: string;

	@IsString()
	@IsNotEmpty()
	@MaxLength(20)
	name: string;

	@IsString()
	@IsNotEmpty()
	@MaxLength(2)
	uf: string;

	constructor(props: StateProps) {
		Object.assign(this, props);
	}
}

export class StateValidator extends ValidatorFields<StateRules> {
	validate(data: StateProps | null): boolean {
		return super.validate(new StateRules(data ?? ({} as StateProps)));
	}
}

export class StateValidatorFactory {
	create(): StateValidator {
		return new StateValidator();
	}
}
