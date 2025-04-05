import { Regex } from '@/shared/domain/utils/regex';
import {
	ArrayNotEmpty,
	IsArray,
	IsBoolean,
	IsCPF,
	IsDate,
	IsEmail,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsPositive,
	IsString,
	Length,
	Matches,
	MaxLength,
	ValidateNested,
	ValidatorFields,
} from '@/shared/domain/validators/validator-fields';
import { IsCNPJ } from '@/shared/infra/decorators/validation/cnpj.decorator';
import { Type } from 'class-transformer';
import { TenantProps } from '../entities/tenant.entity';
import { BannerRules } from './banner.validator';
import { CityRules } from './city.validator';
import { DeliveryRules } from './delivery.validator';
import { OpeningHoursRules } from './opening-hours.validator';
import { PlanRules } from './plan.validator';
import { StateRules } from './state.validator';

export class TenantRules {
	@MaxLength(255)
	@IsString()
	@IsNotEmpty()
	responsibleName: string;

	@IsString()
	@IsNotEmpty()
	@MaxLength(255)
	@Length(11, 11)
	@Matches(Regex.ONLY_DIGITS)
	@IsCPF()
	responsibleCpf: string;

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
	@Matches(Regex.ONLY_DIGITS)
	responsiblePhoneNumber: string;

	@MaxLength(255)
	@IsString()
	@IsNotEmpty()
	@Matches(Regex.NO_SPACES)
	slug: string;

	@MaxLength(20)
	@IsString()
	@IsNotEmpty()
	state: StateRules;

	@MaxLength(35)
	@IsString()
	@IsNotEmpty()
	city: CityRules;

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

	@IsString()
	@IsOptional()
	@Length(12, 13)
	@Matches(Regex.ONLY_DIGITS)
	establishmentPhoneNumber: string;

	@IsNumber()
	@IsNotEmpty()
	longitude: number;

	@IsNumber()
	@IsNotEmpty()
	@MaxLength(100)
	latitude: number;

	@IsString()
	@IsNotEmpty()
	@Length(14, 14)
	@Matches(Regex.ONLY_DIGITS)
	@IsCNPJ()
	cnpj: string;

	@IsString()
	@IsNotEmpty()
	@MaxLength(255)
	corporateReason: string;

	@IsString()
	@IsOptional()
	coverImagePath: string | null;

	@IsString()
	@IsOptional()
	logoImagePath: string | null;

	@IsString()
	@IsNotEmpty()
	description: string;

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => DeliveryRules)
	@IsNotEmpty()
	deliveries: DeliveryRules[];

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => BannerRules)
	@ArrayNotEmpty()
	banners: BannerRules[];

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => OpeningHoursRules)
	@ArrayNotEmpty()
	openingHours: OpeningHoursRules[];

	@IsPositive()
	@IsOptional()
	@Length(6, 6)
	verifyEmailCode: number | null;

	@IsDate()
	@IsOptional()
	emailVerified: Date | null;

	@IsString()
	@IsOptional()
	forgotPasswordEmailVerificationToken: string | null;

	@IsBoolean()
	@IsNotEmpty()
	active: boolean;

	@ValidateNested()
	@Type(() => PlanRules)
	plan: PlanRules;

	constructor(props: TenantProps) {
		Object.assign(this, props);
	}
}

export class TenantValidator extends ValidatorFields<TenantRules> {
	validate(data: TenantProps | null): boolean {
		return super.validate(new TenantRules(data ?? ({} as TenantProps)));
	}
}

export class TenantValidatorFactory {
	create(): TenantValidator {
		return new TenantValidator();
	}
}
