import { Entity } from '@/shared/domain/entities/entity';
import { EntityValidationError } from '@/shared/domain/errors/validation-error';
import { TenantValidatorFactory } from '../validators/tenant.validator';
import { BannerProps, RegisterBannerProps } from './banner.entity';
import { DeliveryProps, RegisterDeliveryProps } from './delivery.entity';
import { OpeninHoursProps, RegisterOpeningHoursProps } from './opening-hours';

export type TenantProps = {
	responsibleName: string;
	responsibleCpf: string;
	email: string;
	phoneNumber: string;

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
	forgotPasswordEmailVerificationToken: string | null;
	active: boolean;

	openingHours: OpeninHoursProps[];
};

type RegisterProps = {
	responsibleName: string;
	responsibleCpf: string;
	email: string;
	phoneNumber: string;

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
	banners: RegisterBannerProps[];
	deliveries: RegisterDeliveryProps[];

	openingHours: RegisterOpeningHoursProps[];
};

export class Tenant extends Entity<TenantProps> {
	static register(registerProps: RegisterProps): Tenant {
		const tenantProps: TenantProps = {
			responsibleName: registerProps.responsibleName,
			cnpj: registerProps.cnpj,
			establishmentPhoneNumber: registerProps.establishmentPhoneNumber,
			corporateReason: registerProps.corporateReason,
			responsibleCpf: registerProps.responsibleCpf,
			email: registerProps.email,
			password: registerProps.password,
			phoneNumber: registerProps.phoneNumber,
			slug: registerProps.slug,
			state: registerProps.state,
			uf: registerProps.uf,
			city: registerProps.city,
			neighborhood: registerProps.neighborhood,
			street: registerProps.street,
			streetNumber: registerProps.streetNumber,
			zipcode: registerProps.zipcode,
			mainColor: registerProps.mainColor,
			banners: registerProps.banners,
			establishmentName: registerProps.establishmentName,
			longitude: registerProps.longitude,
			latitude: registerProps.latitude,
			deliveries: registerProps.deliveries,
			openingHours: registerProps.openingHours,
			coverImagePath: registerProps.coverImagePath,
			logoImagePath: registerProps.logoImagePath,
			description: registerProps.description,
			emailVerified: null,
			forgotPasswordEmailVerificationToken: null,
			active: false,
		};

		Tenant.validate(tenantProps);

		return new Tenant(tenantProps);
	}

	register(registerProps: RegisterProps): void {
		Tenant.validate({ ...this.props, ...registerProps });
		this.responsibleName = registerProps.responsibleName;
		this.email = registerProps.email;
		this.phoneNumber = registerProps.phoneNumber;
		this.zipcode = registerProps.zipcode;
		this.state = registerProps.state;
		this.uf = registerProps.uf;
		this.city = registerProps.city;
		this.neighborhood = registerProps.neighborhood;
		this.street = registerProps.street;
		this.streetNumber = registerProps.streetNumber;
		this.longitude = registerProps.longitude;
		this.latitude = registerProps.latitude;
		this.slug = registerProps.slug;
		this.password = registerProps.password;
		this.mainColor = registerProps.mainColor;
		this.banners = registerProps.banners;
		this.deliveries = registerProps.deliveries;
		this.responsibleCpf = registerProps.responsibleCpf;
		this.cnpj = registerProps.cnpj;
		this.corporateReason = registerProps.corporateReason;
		this.establishmentName = registerProps.establishmentName;
		this.establishmentPhoneNumber = registerProps.establishmentPhoneNumber;
		this.coverImagePath = registerProps.coverImagePath;
		this.logoImagePath = registerProps.logoImagePath;
		this.description = registerProps.description;
		this.openingHours = registerProps.openingHours;
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
	private set phoneNumber(phoneNumber: string) {
		this.props.phoneNumber = phoneNumber;
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
	private set banners(banners: RegisterBannerProps[]) {
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
	private set deliveries(deliveries: RegisterDeliveryProps[]) {
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
	private set openingHours(openingHours: OpeninHoursProps[]) {
		this.props.openingHours = openingHours;
	}
}
