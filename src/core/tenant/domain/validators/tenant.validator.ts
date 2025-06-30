import { CityProps } from '@/shared/domain/entities/city.entity';
import { PlanProps } from '@/shared/domain/entities/plan.entity';
import { StateProps } from '@/shared/domain/entities/state.entity';
import { Regex } from '@/shared/domain/utils/regex';
import {
	IsArray,
	IsBoolean,
	IsCPF,
	IsDate,
	IsEmail,
	IsEnum,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	Length,
	Matches,
	MaxLength,
	MinLength,
	ValidateNested,
	ValidatorFields,
} from '@/shared/domain/validators/validator-fields';
import { IsCNPJ } from '@/shared/infra/decorators/validation/cnpj.decorator';
import { Type } from 'class-transformer';
import {
	CityRules,
	CityValidatorFactory,
} from '../../../../shared/domain/validators/city.validator';
import {
	PlanRules,
	PlanValidatorFactory,
} from '../../../../shared/domain/validators/plan.validator';
import {
	StateRules,
	StateValidatorFactory,
} from '../../../../shared/domain/validators/state.validator';
import { BannerProps } from '../entities/banner.entity';
import { DeliveryProps } from '../entities/delivery.entity';
import { OpeningHoursProps } from '../entities/opening-hours';
import { TenantProps } from '../entities/tenant.entity';
import { BannerRules, BannerValidatorFactory } from './banner.validator';
import { DeliveryRules, DeliveryValidatorFactory } from './delivery.validator';
import {
	OpeningHoursRules,
	OpeningHoursValidatorFactory,
} from './opening-hours.validator';

enum PayerDocumentType {
	CPF = 'CPF',
	CNPJ = 'CNPJ',
}

export class TenantRules {
	@MaxLength(255)
	@IsString()
	@IsNotEmpty()
	responsibleName: string;

	@IsString()
	@IsNotEmpty()
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

	@ValidateNested()
	@Type(() => StateRules)
	@IsNotEmpty()
	state: StateRules;

	@ValidateNested()
	@Type(() => CityRules)
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
	@IsNotEmpty()
	@Length(12, 13)
	@Matches(Regex.ONLY_DIGITS)
	establishmentPhoneNumber: string;

	@IsNumber()
	@IsNotEmpty()
	longitude: number;

	@IsNumber()
	@IsNotEmpty()
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
	@MaxLength(255)
	coverImagePath: string | null;

	@IsString()
	@MaxLength(255)
	@IsOptional()
	logoImagePath: string | null;

	@IsString()
	@IsOptional()
	@MaxLength(1000)
	description: string | null;

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => DeliveryRules)
	deliveries: DeliveryRules[];

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => BannerRules)
	banners: BannerRules[];

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => OpeningHoursRules)
	openingHours: OpeningHoursRules[];

	@IsString()
	@IsOptional()
	@Length(6, 6)
	verifyEmailCode: string | null;

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
	@IsNotEmpty()
	plan: PlanRules;

	@IsString()
	@IsOptional()
	@MaxLength(255)
	payerName: string | null;

	@IsString()
	@IsOptional()
	@MaxLength(14)
	payerDocument: string | null;

	@IsString()
	@IsOptional()
	@MaxLength(4)
	@MinLength(3)
	@IsEnum(PayerDocumentType)
	payerDocumentType: PayerDocumentType | null;

	@MaxLength(255)
	@IsString()
	@IsEmail()
	@IsOptional()
	payerEmail: string | null;

	@IsDate()
	@IsOptional()
	nextDueDate: Date | null;

	constructor(props: TenantProps) {
		Object.assign(this, props);
	}
}

export class TenantValidator extends ValidatorFields<TenantRules> {
	validate(data: TenantProps | null): boolean {
		const isTenantValid = super.validate(
			new TenantRules(data ?? ({} as TenantProps)),
		);
		const isStateValid = this.validateStateRoles(data?.state ?? null);
		const isCityValid = this.validateCityRoles(data?.city ?? null);
		const isDeliveriesValid = this.validateDeliveryRoles(
			data?.deliveries ?? null,
		);
		const isBannersValid = this.validateBannerRoles(data?.banners ?? null);
		const isOpeningHoursValid = this.validateOpeningHourRoles(
			data?.openingHours ?? null,
		);

		const isPlanValid = this.validatePlanRoles(data?.plan ?? null);

		return (
			isTenantValid &&
			isStateValid &&
			isCityValid &&
			isDeliveriesValid &&
			isBannersValid &&
			isOpeningHoursValid &&
			isPlanValid
		);
	}

	private validateStateRoles(stateProps: StateProps | null): boolean {
		const stateRules = new StateValidatorFactory().create();
		const isStateValid = stateRules.validate(stateProps);

		if (stateRules.errors) {
			this.flattenErrors('state', stateRules.errors);
		}

		return isStateValid;
	}

	private validateCityRoles(cityProps: CityProps | null): boolean {
		const cityRules = new CityValidatorFactory().create();
		const isCityValid = cityRules.validate(cityProps);

		if (cityRules.errors) {
			this.flattenErrors('city', cityRules.errors);
		}

		return isCityValid;
	}

	private validateDeliveryRoles(
		deliveriesProps: DeliveryProps[] | null = [],
	): boolean {
		const deliveryRules = new DeliveryValidatorFactory().create();

		const validatedDeliveries = deliveriesProps?.map((delivery, index) => {
			const isValid = deliveryRules.validate(delivery);

			if (deliveryRules.errors) {
				this.flattenErrors(`deliveries.${index}`, deliveryRules.errors);
			}

			return isValid;
		});

		return validatedDeliveries?.every((isValid) => isValid) ?? true;
	}

	private validateBannerRoles(
		bannersProps: BannerProps[] | null = [],
	): boolean {
		const bannerRules = new BannerValidatorFactory().create();

		const validatedBanners = bannersProps?.map((banner, index) => {
			const isValid = bannerRules.validate(banner);

			if (bannerRules.errors) {
				this.flattenErrors(`banners.${index}`, bannerRules.errors);
			}

			return isValid;
		});

		return validatedBanners?.every((isValid) => isValid) ?? true;
	}

	private validateOpeningHourRoles(
		openingHoursProps: OpeningHoursProps[] | null = [],
	): boolean {
		const openingHourRules = new OpeningHoursValidatorFactory().create();

		const validatedOpeningHours = openingHoursProps?.map(
			(openingHour, index) => {
				const isValid = openingHourRules.validate(openingHour);

				if (openingHourRules.errors) {
					this.flattenErrors(`openingHours.${index}`, openingHourRules.errors);
				}

				return isValid;
			},
		);

		return validatedOpeningHours?.every((isValid) => isValid) ?? true;
	}

	private validatePlanRoles(planProps: PlanProps | null): boolean {
		const planRules = new PlanValidatorFactory().create();
		const isPlanValid = planRules.validate(planProps);

		if (planRules.errors) {
			this.flattenErrors('plan', planRules.errors);
		}

		return isPlanValid;
	}
}

export class TenantValidatorFactory {
	create(): TenantValidator {
		return new TenantValidator();
	}
}
