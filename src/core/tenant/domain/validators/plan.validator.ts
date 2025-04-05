import {
	IsNotEmpty,
	IsString,
	ValidatorFields,
} from '@/shared/domain/validators/validator-fields';
import { PlanProps } from '../entities/plan.entity';

export class PlanRules {
	@IsString()
	@IsNotEmpty()
	id: string;

	@IsString()
	@IsNotEmpty()
	name: string;

	@IsString()
	@IsNotEmpty()
	price: string;

	constructor(props: PlanProps) {
		Object.assign(this, props);
	}
}

export class PlanValidator extends ValidatorFields<PlanRules> {
	validate(data: PlanProps | null): boolean {
		return super.validate(new PlanRules(data ?? ({} as PlanProps)));
	}
}

export class PlanValidatorFactory {
	create(): PlanValidator {
		return new PlanValidator();
	}
}
