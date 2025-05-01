import { Transactional } from '@/shared/application/database/decorators/transactional.decorator';
import { ErrorMessages } from '@/shared/application/error-messages/error-messages';
import { BadRequestError } from '@/shared/application/errors/bad-request-error';
import { ConflictError } from '@/shared/application/errors/conflict-error';
import { CityQuery } from '@/shared/application/queries/city.query';
import { PlanQuery } from '@/shared/application/queries/plan.query';
import { StateQuery } from '@/shared/application/queries/state.query';
import { CnpjService } from '@/shared/application/services/cnpj.service';
import { MailService } from '@/shared/application/services/mail.service';
import {
	ZipcodeService,
	ZipcodeServiceResponse,
} from '@/shared/application/services/zipcode.service';
import { UseCase } from '@/shared/application/usecases/use-case';
import { randomBytes } from 'node:crypto';
import { CityProps } from '../../../../shared/domain/entities/city.entity';
import { RegisterTenantPlanProps } from '../../../../shared/domain/entities/plan.entity';
import { StateProps } from '../../../../shared/domain/entities/state.entity';
import {
	RegisterTenantProps,
	Tenant,
} from '../../domain/entities/tenant.entity';
import { TenantRepository } from '../../domain/repositories/tenant.repository';
import { TenantOutput, TenantOutputMapper } from '../outputs/tenant-output';
import { TenantQuery } from '../queries/tenant.query';

export type Input = {
	// Address
	zipcode: string;
	streetName: string;
	neighborhood: string;
	streetNumber: string;
	complement?: string;

	// Responsible infos
	responsibleName: string;
	responsibleCpf: string;
	responsiblePhoneNumber: string;

	// Establishment infos
	cnpj: string;
	establishmentName: string;
	establishmentPhoneNumber: string;
	slug: string;

	// Login infos
	email: string;
	password: string;
};

export type Output = TenantOutput;

export class RegisterTenantUseCase implements UseCase<Input, Output> {
	constructor(
		private readonly tenantRepository: TenantRepository,
		private readonly tenantQuery: TenantQuery,
		private readonly planQuery: PlanQuery,
		private readonly stateQuery: StateQuery,
		private readonly cityQuery: CityQuery,
		private readonly zipcodeService: ZipcodeService,
		private readonly cnpjService: CnpjService,
		private readonly tenantOutputMapper: TenantOutputMapper,
		private readonly mailService: MailService,
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

		const foundInactiveTenant = await this.tenantQuery.getInactiveUserIdByEmail(
			input.email,
		);

		if (foundInactiveTenant) {
			await this.tenantRepository.hardDelete(foundInactiveTenant.id);
		}

		const tenant = Tenant.registerTenant(registerTenantProps);

		await this.tenantRepository.create(tenant);

		await this.sendActivateAccountEmailCode(
			input.email,
			registerTenantProps.verifyEmailCode,
		);

		return this.tenantOutputMapper.toOutput(tenant);
	}

	private async validateRepeatedData(
		email: string,
		cnpj: string,
		slug: string,
	) {
		const [isEmailVerified, cnpjExists, slugExists] = await Promise.all([
			this.tenantQuery.isEmailVerified(email),
			this.tenantQuery.cnpjExists(cnpj),
			this.tenantQuery.slugExists(slug),
		]);

		if (isEmailVerified) {
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
		const plan = await this.planQuery.getPlan();
		const cnpjInfos = await this.cnpjService.getInfosByCnpj(input.cnpj);

		if (!cnpjInfos) {
			throw new BadRequestError(ErrorMessages.cnpjNotFound(input.cnpj));
		}

		const { city, state } = await this.getStateAndCityByNames(
			zipcodeInfos.state,
			zipcodeInfos.city,
		);

		const verifyEmailCode = this.generateEmailVerificationCode();

		return this.formatRegisterTenantProps(
			input,
			zipcodeInfos,
			state,
			city,
			cnpjInfos.corporateReason,
			plan,
			verifyEmailCode,
		);
	}

	// private async createOpeningHoursProps(
	// 	openingHours: OpeningHoursInput[],
	// ): Promise<RegisterTenantOpeningHoursProps[]> {
	// 	return await Promise.all(
	// 		openingHours.map(async ({ weekdayId, end, start }) => {
	// 			const weekday = await this.tenantQuery.getWeekdayById(weekdayId);

	// 			if (!weekday) {
	// 				throw new BadRequestError(ErrorMessages.weekdayNotFound(weekdayId));
	// 			}

	// 			return {
	// 				weekday: {
	// 					id: weekday.id,
	// 					name: weekday.weekdayName,
	// 					shortName: weekday.weekdayShortName,
	// 				},
	// 				end,
	// 				start,
	// 			};
	// 		}),
	// 	);
	// }

	private generateEmailVerificationCode() {
		const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
		const length = 6;
		const bytes = randomBytes(length);
		let result = '';
		for (const byte of bytes) {
			result += characters[byte % characters.length];
		}
		return result;
	}

	private async getStateAndCityByNames(
		stateName: string,
		cityName: string,
	): Promise<{
		state: StateProps;
		city: CityProps;
	}> {
		const [state, city] = await Promise.all([
			this.stateQuery.getOneStateByName(stateName),
			this.cityQuery.getOneCityByName(cityName),
		]);

		if (!state) {
			throw new BadRequestError(ErrorMessages.stateNotFound(stateName));
		}

		if (!city) {
			throw new BadRequestError(ErrorMessages.stateNotFound(cityName));
		}

		return { state, city };
	}

	private async sendActivateAccountEmailCode(
		userEmail: string,
		activateAccountCode: string,
	): Promise<void> {
		const content = `Olá o seu código de ativação da conta é ${activateAccountCode}`;

		const mailOptions = {
			to: userEmail,
			subject: 'Ative o cadastro do estabelecimento no Nextway',
			content,
		};

		await this.mailService.sendMail(mailOptions);
	}

	private formatRegisterTenantProps(
		input: Input,
		zipcodeInfos: ZipcodeServiceResponse,
		state: StateProps,
		city: CityProps,
		corporateReason: string,
		plan: RegisterTenantPlanProps,
		verifyEmailCode: string,
	): RegisterTenantProps {
		return {
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
			neighborhood: input.neighborhood,
			street: input.streetName,
			streetNumber: input.streetNumber,
			zipcode: input.zipcode,
			establishmentName: input.establishmentName,
			longitude: +zipcodeInfos.location.coordinates.longitude,
			latitude: +zipcodeInfos.location.coordinates.latitude,
			plan,
			verifyEmailCode,
		};
	}
}
