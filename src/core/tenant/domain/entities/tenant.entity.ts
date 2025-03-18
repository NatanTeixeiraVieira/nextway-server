import { Entity } from '@/shared/domain/entities/entity';
import { EntityValidationError } from '@/shared/domain/errors/validation-error';
import { TenantValidatorFactory } from '../validators/tenant.validator';
import { BannerProps, RegisterTenantBannerProps } from './banner.entity';
import { DeliveryProps, RegisterTenantDeliveryProps } from './delivery.entity';
import {
	OpeningHoursProps,
	RegisterTenantOpeningHoursProps,
} from './opening-hours';
import { PlanProps, RegisterTenantPlanProps } from './plan.entity';

export type TenantProps = {
	responsibleName: string;
	responsibleCpf: string;
	email: string;
	responsiblePhoneNumber: string;

	zipcode: string;
	state: string;
	uf: string;
	city: string;
	neighborhood: string;
	street: string;
	streetNumber: string;
	longitude: number;
	latitude: number;

	cnpj: string;
	corporateReason: string;
	establishmentName: string;
	establishmentPhoneNumber: string;
	slug: string;
	password: string;

	mainColor: string;
	coverImagePath: string | null;
	logoImagePath: string | null;
	description: string;
	banners: BannerProps[];
	deliveries: DeliveryProps[];

	emailVerified: Date | null;
	verifyEmailCode: number | null;
	forgotPasswordEmailVerificationToken: string | null;
	active: boolean;

	openingHours: OpeningHoursProps[];
	plan: PlanProps;
};

export type RegisterTenantProps = {
	responsibleName: string;
	responsibleCpf: string;
	email: string;
	responsiblePhoneNumber: string;

	zipcode: string;
	state: string;
	uf: string;
	city: string;
	neighborhood: string;
	street: string;
	streetNumber: string;
	longitude: number;
	latitude: number;

	cnpj: string;
	corporateReason: string;
	establishmentName: string;
	establishmentPhoneNumber: string;
	slug: string;
	password: string;

	mainColor: string;
	coverImagePath: string | null;
	logoImagePath: string | null;
	description: string;
	banners: RegisterTenantBannerProps[];
	deliveries: RegisterTenantDeliveryProps[];

	openingHours: RegisterTenantOpeningHoursProps[];
	plan: RegisterTenantPlanProps;
};

export class Tenant extends Entity<TenantProps> {
	// TODO Add CPF validation
	static registerTenant(registerTenantProps: RegisterTenantProps): Tenant {
		const tenantProps: TenantProps = {
			responsibleName: registerTenantProps.responsibleName,
			cnpj: registerTenantProps.cnpj,
			establishmentPhoneNumber: registerTenantProps.establishmentPhoneNumber,
			corporateReason: registerTenantProps.corporateReason,
			responsibleCpf: registerTenantProps.responsibleCpf,
			email: registerTenantProps.email,
			password: registerTenantProps.password,
			responsiblePhoneNumber: registerTenantProps.responsiblePhoneNumber,
			slug: registerTenantProps.slug,
			state: registerTenantProps.state,
			uf: registerTenantProps.uf,
			city: registerTenantProps.city,
			neighborhood: registerTenantProps.neighborhood,
			street: registerTenantProps.street,
			streetNumber: registerTenantProps.streetNumber,
			zipcode: registerTenantProps.zipcode,
			mainColor: registerTenantProps.mainColor,
			banners: registerTenantProps.banners,
			establishmentName: registerTenantProps.establishmentName,
			longitude: registerTenantProps.longitude,
			latitude: registerTenantProps.latitude,
			deliveries: registerTenantProps.deliveries,
			openingHours: registerTenantProps.openingHours,
			coverImagePath: registerTenantProps.coverImagePath,
			logoImagePath: registerTenantProps.logoImagePath,
			description: registerTenantProps.description,
			plan: registerTenantProps.plan,
			verifyEmailCode: null,
			emailVerified: null,
			forgotPasswordEmailVerificationToken: null,
			active: false,
		};

		Tenant.validate(tenantProps);

		return new Tenant(tenantProps);
	}

	registerTenant(registerTenantProps: RegisterTenantProps): void {
		Tenant.validate({ ...this.props, ...registerTenantProps });
		this.responsibleName = registerTenantProps.responsibleName;
		this.email = registerTenantProps.email;
		this.responsiblePhoneNumber = registerTenantProps.responsiblePhoneNumber;
		this.zipcode = registerTenantProps.zipcode;
		this.state = registerTenantProps.state;
		this.uf = registerTenantProps.uf;
		this.city = registerTenantProps.city;
		this.neighborhood = registerTenantProps.neighborhood;
		this.street = registerTenantProps.street;
		this.streetNumber = registerTenantProps.streetNumber;
		this.longitude = registerTenantProps.longitude;
		this.latitude = registerTenantProps.latitude;
		this.slug = registerTenantProps.slug;
		this.password = registerTenantProps.password;
		this.mainColor = registerTenantProps.mainColor;
		this.banners = registerTenantProps.banners;
		this.deliveries = registerTenantProps.deliveries;
		this.responsibleCpf = registerTenantProps.responsibleCpf;
		this.cnpj = registerTenantProps.cnpj;
		this.corporateReason = registerTenantProps.corporateReason;
		this.establishmentName = registerTenantProps.establishmentName;
		this.establishmentPhoneNumber =
			registerTenantProps.establishmentPhoneNumber;
		this.coverImagePath = registerTenantProps.coverImagePath;
		this.logoImagePath = registerTenantProps.logoImagePath;
		this.description = registerTenantProps.description;
		this.openingHours = registerTenantProps.openingHours;
	}

	private static validate(props: TenantProps) {
		const tenantValidatorFactory = new TenantValidatorFactory();
		const validator = tenantValidatorFactory.create();
		const isValid = validator.validate(props);

		if (!isValid) {
			throw new EntityValidationError(validator.errors);
		}
	}

	private set responsibleName(responsibleName: string) {
		this.props.responsibleName = responsibleName;
	}
	private set email(email: string) {
		this.props.email = email;
	}
	private set password(password: string) {
		this.props.password = password;
	}
	private set slug(slug: string) {
		this.props.slug = slug;
	}
	private set responsiblePhoneNumber(responsiblePhoneNumber: string) {
		this.props.responsiblePhoneNumber = responsiblePhoneNumber;
	}
	private set state(state: string) {
		this.props.state = state;
	}
	private set uf(uf: string) {
		this.props.uf = uf;
	}
	private set city(city: string) {
		this.props.city = city;
	}
	private set neighborhood(neighborhood: string) {
		this.props.neighborhood = neighborhood;
	}
	private set street(street: string) {
		this.props.street = street;
	}
	private set streetNumber(streetNumber: string) {
		this.props.streetNumber = streetNumber;
	}
	private set zipcode(zipcode: string) {
		this.props.zipcode = zipcode;
	}
	private set mainColor(mainColor: string) {
		this.props.mainColor = mainColor;
	}
	private set banners(banners: RegisterTenantBannerProps[]) {
		this.props.banners = banners;
	}
	private set establishmentName(establishmentName: string) {
		this.props.establishmentName = establishmentName;
	}
	private set longitude(longitude: number) {
		this.props.longitude = longitude;
	}
	private set latitude(latitude: number) {
		this.props.latitude = latitude;
	}
	private set deliveries(deliveries: RegisterTenantDeliveryProps[]) {
		this.props.deliveries = deliveries;
	}
	private set responsibleCpf(responsibleCpf: string) {
		this.props.responsibleCpf = responsibleCpf;
	}
	private set cnpj(cnpj: string) {
		this.props.cnpj = cnpj;
	}
	private set corporateReason(corporateReason: string) {
		this.props.corporateReason = corporateReason;
	}
	private set establishmentPhoneNumber(establishmentPhoneNumber: string) {
		this.props.establishmentPhoneNumber = establishmentPhoneNumber;
	}
	private set coverImagePath(coverImagePath: string | null) {
		this.props.coverImagePath = coverImagePath;
	}
	private set logoImagePath(logoImagePath: string | null) {
		this.props.logoImagePath = logoImagePath;
	}
	private set description(description: string) {
		this.props.description = description;
	}
	private set openingHours(openingHours: OpeningHoursProps[]) {
		this.props.openingHours = openingHours;
	}
}
