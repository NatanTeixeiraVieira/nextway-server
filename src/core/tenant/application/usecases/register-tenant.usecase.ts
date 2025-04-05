import { Transactional } from '@/shared/application/database/decorators/transactional.decorator';
import { ErrorMessages } from '@/shared/application/error-messages/error-messages';
import { BadRequestError } from '@/shared/application/errors/bad-request-error';
import { ConflictError } from '@/shared/application/errors/conflict-error';
import { CnpjService } from '@/shared/application/services/cnpj.service';
import {
	ZipcodeService,
	ZipcodeServiceResponse,
} from '@/shared/application/services/zipcode.service';
import { UseCase } from '@/shared/application/usecases/use-case';
import { CityProps } from '../../domain/entities/city.entity';
import { RegisterTenantOpeningHoursProps } from '../../domain/entities/opening-hours';
import { RegisterTenantPlanProps } from '../../domain/entities/plan.entity';
import { StateProps } from '../../domain/entities/state.entity';
import {
	RegisterTenantProps,
	Tenant,
} from '../../domain/entities/tenant.entity';
import { TenantRepository } from '../../domain/repositories/tenant.repository';
import { TenantOutput, TenantOutputMapper } from '../outputs/tenant-output';
import { TenantQuery } from '../queries/tenant.query';

type DeliveryInput = {
	deliveryRadiusKm: number;
	deliveryPrice: number;
};

type OpeningHoursInput = {
	weekdayId: string;
	start: string;
	end: string;
};

export type Input = {
	// Address
	zipcode: string;
	streetNumber: string;

	// Responsible infos
	responsibleName: string;
	responsibleCpf: string;
	responsiblePhoneNumber: string;
	neighborhood?: string;

	// Establishment infos
	cnpj: string;
	establishmentName: string;
	establishmentPhoneNumber: string;

	// Plan choice
	planId: string;

	// Login infos
	email: string;
	password: string;

	// Establishment configurations
	openingHours: OpeningHoursInput[];
	slug: string;
	mainColor: string;
	description: string;
	deliveries: DeliveryInput[];
};

export type Output = TenantOutput;

export class RegisterTenantUseCase implements UseCase<Input, Output> {
	constructor(
		private readonly tenantRepository: TenantRepository,
		private readonly tenantQuery: TenantQuery,
		private readonly zipcodeService: ZipcodeService,
		private readonly cnpjService: CnpjService,
		private readonly tenantOutputMapper: TenantOutputMapper,
	) {}

	@Transactional()
	async execute(input: Input): Promise<TenantOutput> {
		await this.validateRepeatedData(input.email, input.cnpj, input.slug);
		const zipcodeInfos = await this.zipcodeService.getInfosByZipcode(
			input.zipcode,
		);

		const registerTenantProps = await this.createRegisterTenantProps(
			input,
			zipcodeInfos,
		);

		const tenant = Tenant.registerTenant(registerTenantProps);

		await this.tenantRepository.create(tenant);

		return this.tenantOutputMapper.toOutput(tenant);
	}

	private async validateRepeatedData(
		email: string,
		cnpj: string,
		slug: string,
	) {
		const [emailExists, cnpjExists, slugExists] = await Promise.all([
			this.tenantQuery.emailExists(email),
			this.tenantQuery.cnpjExists(cnpj),
			this.tenantQuery.slugExists(slug),
		]);

		if (emailExists) {
			throw new ConflictError(ErrorMessages.EMAIL_ALREADY_EXISTS);
		}

		if (cnpjExists) {
			throw new ConflictError(ErrorMessages.CNPJ_ALREADY_EXISTS);
		}

		if (slugExists) {
			throw new ConflictError(ErrorMessages.SLUG_ALREADY_EXISTS);
		}
	}

	private async createRegisterTenantProps(
		input: Input,
		zipcodeInfos: ZipcodeServiceResponse,
	): Promise<RegisterTenantProps> {
		const plan = await this.tenantQuery.getPlan();
		const { corporateReason } = await this.cnpjService.getInfosByCnpj(
			input.cnpj,
		);

		const openingHours: RegisterTenantOpeningHoursProps[] = await Promise.all(
			input.openingHours.map(async ({ weekdayId, end, start }) => {
				const weekday = await this.tenantQuery.getWeekdayById(weekdayId);

				if (!weekday) {
					throw new BadRequestError(ErrorMessages.weekdayNotFound(weekdayId));
				}

				return {
					weekday: {
						id: weekday.id,
						name: weekday.weekdayName,
						shortName: weekday.weekdayShortName,
					},
					end,
					start,
				};
			}),
		);

		const [state, city] = await Promise.all([
			this.tenantQuery.getOneStateByName(zipcodeInfos.state),
			this.tenantQuery.getOneCityByName(zipcodeInfos.city),
		]);

		if (!state) {
			throw new BadRequestError(
				ErrorMessages.stateNotFound(zipcodeInfos.state),
			);
		}

		if (!city) {
			throw new BadRequestError(ErrorMessages.stateNotFound(zipcodeInfos.city));
		}

		return this.formatRegisterTenantProps(
			input,
			zipcodeInfos,
			state,
			city,
			corporateReason,
			// coverImagePath,
			// logoImagePath,
			openingHours,
			// banners,
			plan,
		);
	}

	private formatRegisterTenantProps(
		input: Input,
		zipcodeInfos: ZipcodeServiceResponse,
		state: StateProps,
		city: CityProps,
		corporateReason: string,
		// coverImagePath: string | null,
		// logoImagePath: string | null,
		openingHours: RegisterTenantOpeningHoursProps[],
		// banners: RegisterTenantBannerProps[],
		plan: RegisterTenantPlanProps,
	): RegisterTenantProps {
		const registerTenantProps: RegisterTenantProps = {
			responsibleName: input.responsibleName,
			cnpj: input.cnpj,
			establishmentPhoneNumber: input.establishmentPhoneNumber,
			corporateReason,
			responsibleCpf: input.responsibleCpf,
			email: input.email,
			password: input.password,
			responsiblePhoneNumber: input.responsiblePhoneNumber,
			slug: input.slug,
			state,
			city,
			neighborhood: zipcodeInfos.neighborhood,
			street: zipcodeInfos.street,
			streetNumber: input.streetNumber,
			zipcode: input.zipcode,
			mainColor: input.mainColor,
			establishmentName: input.establishmentName,
			longitude: +zipcodeInfos.location.coordinates.longitude,
			latitude: +zipcodeInfos.location.coordinates.latitude,
			deliveries: input.deliveries,
			openingHours,
			description: input.description,
			plan,
		};

		return registerTenantProps;
	}
}
