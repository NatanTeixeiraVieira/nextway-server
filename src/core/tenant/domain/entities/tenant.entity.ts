import { Data } from '@/shared/domain/decorators/data.decorator';
import { Entity } from '@/shared/domain/entities/entity';
import { EntityValidationError } from '@/shared/domain/errors/validation-error';
import { TenantValidatorFactory } from '../validators/tenant.validator';
import { BannerProps } from './banner.entity';
import { CityProps } from './city.entity';
import { DeliveryProps } from './delivery.entity';
import { OpeningHoursProps } from './opening-hours';
import { PlanProps, RegisterTenantPlanProps } from './plan.entity';
import { StateProps } from './state.entity';

export type TenantProps = {
	responsibleName: string;
	responsibleCpf: string;
	email: string;
	responsiblePhoneNumber: string;

	zipcode: string;
	state: StateProps;
	city: CityProps;
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
	description: string | null;
	banners: BannerProps[];
	deliveries: DeliveryProps[];

	emailVerified: Date | null;
	verifyEmailCode: string | null;
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
	state: StateProps;
	city: CityProps;
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
	verifyEmailCode: string;

	plan: RegisterTenantPlanProps;
};

export interface Tenant extends TenantProps {}

@Data()
export class Tenant extends Entity<TenantProps> {
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
			city: registerTenantProps.city,
			neighborhood: registerTenantProps.neighborhood,
			street: registerTenantProps.street,
			streetNumber: registerTenantProps.streetNumber,
			zipcode: registerTenantProps.zipcode,
			mainColor: '#4CAF50',
			banners: [],
			establishmentName: registerTenantProps.establishmentName,
			longitude: registerTenantProps.longitude,
			latitude: registerTenantProps.latitude,
			deliveries: [],
			openingHours: [],
			coverImagePath: null,
			logoImagePath: null,
			description: null,
			plan: registerTenantProps.plan,
			verifyEmailCode: registerTenantProps.verifyEmailCode,
			emailVerified: null,
			forgotPasswordEmailVerificationToken: null,
			active: false,
		};

		Tenant.validate(tenantProps);

		return new Tenant(tenantProps);
	}

	checkEmail(): void {
		Tenant.validate(this.props);
		// this.emailVerified = new Date();
		// this.active = true;
	}

	deleteAccount(): void {
		Tenant.validate(this.props);
		this.markAsDeleted();
		this.updateTimestamp();
	}

	private static validate(props: TenantProps) {
		const tenantValidatorFactory = new TenantValidatorFactory();
		const validator = tenantValidatorFactory.create();
		const isValid = validator.validate(props);

		if (!isValid) {
			throw new EntityValidationError(validator.errors);
		}
	}

	// get responsibleName(): string {
	// 	return this.props.responsibleName;
	// }

	// get responsibleCpf(): string {
	// 	return this.props.responsibleCpf;
	// }

	// get email(): string {
	// 	return this.props.email;
	// }

	// get responsiblePhoneNumber(): string {
	// 	return this.props.responsiblePhoneNumber;
	// }

	// get zipcode(): string {
	// 	return this.props.zipcode;
	// }

	// get state(): StateProps {
	// 	return this.props.state;
	// }

	// get city(): CityProps {
	// 	return this.props.city;
	// }

	// get neighborhood(): string {
	// 	return this.props.neighborhood;
	// }

	// get street(): string {
	// 	return this.props.street;
	// }

	// get streetNumber(): string {
	// 	return this.props.streetNumber;
	// }

	// get longitude(): number {
	// 	return this.props.longitude;
	// }

	// get latitude(): number {
	// 	return this.props.latitude;
	// }

	// get cnpj(): string {
	// 	return this.props.cnpj;
	// }

	// get corporateReason(): string {
	// 	return this.props.corporateReason;
	// }

	// get establishmentName(): string {
	// 	return this.props.establishmentName;
	// }

	// get establishmentPhoneNumber(): string {
	// 	return this.props.establishmentPhoneNumber;
	// }

	// get slug(): string {
	// 	return this.props.slug;
	// }

	// get password(): string {
	// 	return this.props.password;
	// }

	// get mainColor(): string {
	// 	return this.props.mainColor;
	// }

	// get coverImagePath(): string | null {
	// 	return this.props.coverImagePath;
	// }

	// get logoImagePath(): string | null {
	// 	return this.props.logoImagePath;
	// }

	// get description(): string | null {
	// 	return this.props.description;
	// }

	// get banners(): BannerProps[] {
	// 	return this.props.banners;
	// }

	// get deliveries(): DeliveryProps[] {
	// 	return this.props.deliveries;
	// }

	// get emailVerified(): Date | null {
	// 	return this.props.emailVerified;
	// }

	// get verifyEmailCode(): string | null {
	// 	return this.props.verifyEmailCode;
	// }

	// get forgotPasswordEmailVerificationToken(): string | null {
	// 	return this.props.forgotPasswordEmailVerificationToken;
	// }

	// get active(): boolean {
	// 	return this.props.active;
	// }

	// get openingHours(): OpeningHoursProps[] {
	// 	return this.props.openingHours;
	// }

	// get plan(): PlanProps {
	// 	return this.props.plan;
	// }

	// private set responsibleName(responsibleName: string) {
	// 	this.props.responsibleName = responsibleName;
	// }
	// private set email(email: string) {
	// 	this.props.email = email;
	// }
	// private set password(password: string) {
	// 	this.props.password = password;
	// }
	// private set slug(slug: string) {
	// 	this.props.slug = slug;
	// }
	// private set responsiblePhoneNumber(responsiblePhoneNumber: string) {
	// 	this.props.responsiblePhoneNumber = responsiblePhoneNumber;
	// }
	// private set state(state: StateProps) {
	// 	this.props.state = state;
	// }
	// private set city(city: CityProps) {
	// 	this.props.city = city;
	// }
	// private set neighborhood(neighborhood: string) {
	// 	this.props.neighborhood = neighborhood;
	// }
	// private set street(street: string) {
	// 	this.props.street = street;
	// }
	// private set streetNumber(streetNumber: string) {
	// 	this.props.streetNumber = streetNumber;
	// }
	// private set zipcode(zipcode: string) {
	// 	this.props.zipcode = zipcode;
	// }
	// private set mainColor(mainColor: string) {
	// 	this.props.mainColor = mainColor;
	// }
	// private set banners(banners: RegisterTenantBannerProps[]) {
	// 	this.props.banners = banners;
	// }
	// private set establishmentName(establishmentName: string) {
	// 	this.props.establishmentName = establishmentName;
	// }
	// private set longitude(longitude: number) {
	// 	this.props.longitude = longitude;
	// }
	// private set latitude(latitude: number) {
	// 	this.props.latitude = latitude;
	// }
	// private set deliveries(deliveries: RegisterTenantDeliveryProps[]) {
	// 	this.props.deliveries = deliveries;
	// }
	// private set responsibleCpf(responsibleCpf: string) {
	// 	this.props.responsibleCpf = responsibleCpf;
	// }
	// private set cnpj(cnpj: string) {
	// 	this.props.cnpj = cnpj;
	// }
	// private set corporateReason(corporateReason: string) {
	// 	this.props.corporateReason = corporateReason;
	// }
	// private set establishmentPhoneNumber(establishmentPhoneNumber: string) {
	// 	this.props.establishmentPhoneNumber = establishmentPhoneNumber;
	// }
	// private set coverImagePath(coverImagePath: string | null) {
	// 	this.props.coverImagePath = coverImagePath;
	// }
	// private set logoImagePath(logoImagePath: string | null) {
	// 	this.props.logoImagePath = logoImagePath;
	// }
	// private set description(description: string) {
	// 	this.props.description = description;
	// }
	// private set openingHours(openingHours: OpeningHoursProps[]) {
	// 	this.props.openingHours = openingHours;
	// }
	// private set emailVerified(date: Date) {
	// 	this.props.emailVerified = date;
	// }
}
