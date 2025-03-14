import {
	IsArray,
	IsBoolean,
	IsDate,
	IsEmail,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	Length,
	Matches,
	MaxLength,
	ValidateNested,
	ValidatorFields,
} from '@/shared/domain/validators/validator-fields';
import { Type } from 'class-transformer';
import { RegisterBannerProps } from '../entities/banner.entity';
import { TenantProps } from '../entities/tenant.entity';
import { DeliveryRules } from './delivery.validator';

export class TenantRules {
	@MaxLength(255)
	@IsString()
	@IsNotEmpty()
	responsibleName: string;

	@MaxLength(255)
	@IsString()
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@MaxLength(100)
	@IsString()
	@IsNotEmpty()
	password: string;

	@IsString()
	@IsOptional()
	@Length(13, 13)
	@Matches(/^\d+$/)
	phoneNumber: string;

	@MaxLength(255)
	@IsString()
	@IsNotEmpty()
	slug: string;

	@MaxLength(20)
	@IsString()
	@IsNotEmpty()
	state: string;

	@MaxLength(2)
	@IsString()
	@IsNotEmpty()
	uf: string;

	@MaxLength(35)
	@IsString()
	@IsNotEmpty()
	city: string;

	@MaxLength(50)
	@IsString()
	@IsNotEmpty()
	neighborhood: string;

	@MaxLength(100)
	@IsString()
	@IsNotEmpty()
	street: string;

	@MaxLength(10)
	@IsString()
	@IsNotEmpty()
	streetNumber: string;

	@MaxLength(8)
	@IsString()
	@IsNotEmpty()
	zipcode: string;

	@MaxLength(7)
	@IsString()
	@IsNotEmpty()
	mainColor: string;

	@MaxLength(255)
	@IsString()
	@IsNotEmpty()
	establishmentName: string;

	@IsNumber()
	@IsNotEmpty()
	longitude: number;

	@IsNumber()
	@IsNotEmpty()
	latitude: number;

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => DeliveryRules)
	@IsNotEmpty()
	deliveries: DeliveryRules[];

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => DeliveryRules)
	@IsNotEmpty()
	@IsNotEmpty()
	banners: RegisterBannerProps[];

	@IsDate()
	@IsOptional()
	emailVerified: Date | null;

	@IsString()
	@IsOptional()
	forgotPasswordEmailVerificationToken: string | null;

	@IsBoolean()
	@IsNotEmpty()
	active: boolean;

	constructor(props: TenantProps) {
		Object.assign(this, props);
	}
}

export class TenantValidator extends ValidatorFields<TenantRules> {
	validate(data: TenantRules | null): boolean {
		return super.validate(new TenantRules(data ?? ({} as TenantProps)));
	}
}

export class TenantValidatorFactory {
	create(): TenantValidator {
		return new TenantValidator();
	}
}
