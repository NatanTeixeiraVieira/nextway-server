import { Entity } from '@/shared/domain/entities/entity';
import { EntityValidationError } from '@/shared/domain/errors/validation-error';
import { TenantValidatorFactory } from '../validators/tenant.validator';
import { BannerProps, RegisterBannerProps } from './banner.entity';
import { DeliveryProps, RegisterDeliveryProps } from './delivery.entity';

export type TenantProps = {
	email: string;
	password: string;
	slug: string;
	responsibleName: string;
	phoneNumber: string;
	state: string;
	uf: string;
	city: string;
	neighborhood: string;
	street: string;
	streetNumber: string;
	zipcode: string;
	emailVerified: Date | null;
	forgotPasswordEmailVerificationToken: string | null;
	active: boolean;
	banners: BannerProps[];
	establishmentName: string;
	longitude: number;
	latitude: number;
	mainColor: string;
	deliveryProps: DeliveryProps[];
};

type RegisterProps = {
	responsibleName: string;
	email: string;
	password: string;
	slug: string;
	phoneNumber: string;
	state: string;
	uf: string;
	city: string;
	neighborhood: string;
	street: string;
	streetNumber: string;
	zipcode: string;
	mainColor: string;
	banners: RegisterBannerProps[];
	establishmentName: string;
	longitude: number;
	latitude: number;
	deliveryProps: RegisterDeliveryProps[];
};

export class Tenant extends Entity<TenantProps> {
	static register(registerProps: RegisterProps): Tenant {
		const tenantProps: TenantProps = {
			responsibleName: registerProps.responsibleName,
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
			deliveryProps: registerProps.deliveryProps,
			emailVerified: null,
			forgotPasswordEmailVerificationToken: null,
			active: false,
		};

		Tenant.validate(tenantProps);

		return new Tenant(tenantProps);
	}

	private static validate(props: TenantProps) {
		const tenantValidatorFactory = new TenantValidatorFactory();
		const validator = tenantValidatorFactory.create();
		const isValid = validator.validate(props);

		if (!isValid) {
			throw new EntityValidationError(validator.errors);
		}
	}

	register(registerProps: RegisterProps): void {
		Tenant.validate({ ...this.props, ...registerProps });
		this.responsibleName = registerProps.responsibleName;
		this.email = registerProps.email;
		this.password = registerProps.password;
		this.slug = registerProps.slug;
		this.phoneNumber = registerProps.phoneNumber;
		this.state = registerProps.state;
		this.uf = registerProps.uf;
		this.city = registerProps.city;
		this.neighborhood = registerProps.neighborhood;
		this.street = registerProps.street;
		this.streetNumber = registerProps.streetNumber;
		this.zipcode = registerProps.zipcode;
		this.mainColor = registerProps.mainColor;
		this.banners = registerProps.banners;
		this.establishmentName = registerProps.establishmentName;
		this.longitude = registerProps.longitude;
		this.latitude = registerProps.latitude;
		this.deliveryProps = registerProps.deliveryProps;
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
	private set deliveryProps(deliveryProps: RegisterDeliveryProps[]) {
		this.props.deliveryProps = deliveryProps;
	}
}
