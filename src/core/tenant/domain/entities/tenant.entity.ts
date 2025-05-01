import { Data } from '@/shared/domain/decorators/data.decorator';
import { Entity } from '@/shared/domain/entities/entity';
import { EntityValidationError } from '@/shared/domain/errors/validation-error';
import {
	PlanProps,
	RegisterTenantPlanProps,
} from '../../../../shared/domain/entities/plan.entity';
import { StateProps } from '../../../../shared/domain/entities/state.entity';
import { TenantValidatorFactory } from '../validators/tenant.validator';
import { BannerProps } from './banner.entity';
import { CityProps } from './city.entity';
import { DeliveryProps } from './delivery.entity';
import { OpeningHoursProps } from './opening-hours';

export type PayerDocumentType = 'CPF' | 'CNPJ';

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

	payerName: string | null;
	payerDocument: string | null;
	payerDocumentType: PayerDocumentType | null;
	payerEmail: string | null;

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
			payerDocument: null,
			payerDocumentType: null,
			payerEmail: null,
			payerName: null,
		};

		Tenant.validate(tenantProps);

		return new Tenant(tenantProps);
	}

	checkEmail(): void {
		Tenant.validate(this.props);
		this.emailVerified = new Date();
		this.verifyEmailCode = null;
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
}
