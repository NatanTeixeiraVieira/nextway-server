import {
	IsDate,
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsPositive,
	IsString,
	ValidateNested,
	ValidatorFields,
} from '@/shared/domain/validators/validator-fields';
import { Type } from 'class-transformer';
import {
	TenantPaymentProps,
	TenantPaymentStatus,
} from '../entities/tenant-payment.entity';
import { CardRules } from './card.validator';

export class TenantPaymentRules {
	@IsString()
	@IsNotEmpty()
	tenantId: string;

	@IsPositive()
	@IsNotEmpty()
	price: number;

	@IsString()
	@IsNotEmpty()
	currency: string;

	@ValidateNested()
	@Type(() => CardRules)
	@IsNotEmpty()
	card: CardRules;

	@IsEnum(TenantPaymentStatus)
	@IsNotEmpty()
	status: TenantPaymentStatus;

	@IsDate()
	@IsOptional()
	nextDueDate: Date | null;

	constructor(props: TenantPaymentProps) {
		Object.assign(this, props);
	}
}

export class TenantPaymentValidator extends ValidatorFields<TenantPaymentRules> {
	validate(data: TenantPaymentProps | null): boolean {
		return super.validate(
			new TenantPaymentRules(data ?? ({} as TenantPaymentProps)),
		);
	}
}

export class TenantPaymentValidatorFactory {
	create(): TenantPaymentValidator {
		return new TenantPaymentValidator();
	}
}
