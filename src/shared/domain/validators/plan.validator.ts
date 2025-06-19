import {
	IsNotEmpty,
	IsNumber,
	IsPositive,
	IsString,
	MaxLength,
	ValidatorFields,
} from '@/shared/domain/validators/validator-fields';
import { PlanProps } from '../entities/plan.entity';

export class PlanRules {
	@IsString()
	@IsNotEmpty()
	@MaxLength(255)
	id: string;

	@IsString()
	@IsNotEmpty()
	@MaxLength(30)
	name: string;

	@IsNumber()
	@IsPositive()
	price: number;

	@IsString()
	@IsNotEmpty()
	@MaxLength(255)
	externalId: string;

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
