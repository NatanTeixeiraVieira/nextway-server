import { OutputMapper } from '@/shared/application/outputs/output-mapper';
import { Audit } from '@/shared/domain/entities/entity';
import { PlanOutput } from '../../../../shared/application/outputs/plan-output';
import { Tenant } from '../../domain/entities/tenant.entity';
import { BannerOutput } from './banner-output';
import { DeliveryOutput } from './delivery-output';
import { OpeningHoursOutput } from './opening-hours-output';

export type TenantOutput = {
	id: string;
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
	banners: BannerOutput[];
	deliveries: DeliveryOutput[];

	emailVerified: Date | null;
	verifyEmailCode: number | null;
	forgotPasswordEmailVerificationToken: string | null;
	active: boolean;

	openingHours: OpeningHoursOutput[];
	plan: PlanOutput;

	audit: Audit;
};

export class TenantOutputMapper extends OutputMapper<Tenant, TenantOutput> {}
