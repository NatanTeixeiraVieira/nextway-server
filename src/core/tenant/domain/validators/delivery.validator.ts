import {
	IsNotEmpty,
	IsPositive,
	ValidatorFields,
} from '@/shared/domain/validators/validator-fields';
import { DeliveryProps } from '../entities/delivery.entity';

export class DeliveryRules {
	@IsPositive()
	@IsNotEmpty()
	deliveryRadiusKm: number;

	@IsPositive()
	@IsNotEmpty()
	deliveryPrice: number;

	constructor(props: DeliveryProps) {
		Object.assign(this, props);
	}
}

export class DeliveryValidator extends ValidatorFields<DeliveryRules> {
	validate(data: DeliveryProps | null): boolean {
		return super.validate(new DeliveryRules(data ?? ({} as DeliveryProps)));
	}
}

export class DeliveryValidatorFactory {
	create(): DeliveryValidator {
		return new DeliveryValidator();
	}
}
