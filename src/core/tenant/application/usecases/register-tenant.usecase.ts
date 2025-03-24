import { Transactional } from '@/shared/application/database/decorators/transactional.decorator';
import { ErrorMessages } from '@/shared/application/error-messages/error-messages';
import { ConflictError } from '@/shared/application/errors/conflict-error';
import { CnpjService } from '@/shared/application/services/cnpj.service';
import {
	FileService,
	UploadFile,
} from '@/shared/application/services/file.service';
import {
	ZipcodeService,
	ZipcodeServiceResponse,
} from '@/shared/application/services/zipcode.service';
import { UseCase } from '@/shared/application/usecases/use-case';
import { RegisterTenantOpeningHoursProps } from '../../domain/entities/opening-hours';
import { RegisterTenantPlanProps } from '../../domain/entities/plan.entity';
import {
	RegisterTenantProps,
	Tenant,
} from '../../domain/entities/tenant.entity';
import { TenantRepository } from '../../domain/repositories/tenant.repository';
import { TenantOutput, TenantOutputMapper } from '../outputs/tenant-output';
import { TenantQuery } from '../queries/tenant.query';

type BannersErrors = {
	name: string;
	errors: string[];
};

type BannerInput = {
	active: boolean;
	image: UploadFile;
};

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

	// TODO Add payment here

	// Establishment configurations
	openingHours: OpeningHoursInput[];
	// coverImage?: UploadFile;
	// logoImage?: UploadFile;
	slug: string;
	mainColor: string;
	description: string;
	// banners: BannerInput[];
	deliveries: DeliveryInput[];
};

export type Output = TenantOutput;

export class RegisterTenantUseCase implements UseCase<Input, Output> {
	// private readonly allowedMimeTypes = ['image/jpeg', 'image/png'];
	// private readonly maxSizeInBytes = 5 * 1024 * 1024; // 5 MB

	constructor(
		private readonly tenantRepository: TenantRepository,
		private readonly tenantQuery: TenantQuery,
		private readonly zipcodeService: ZipcodeService,
		private readonly cnpjService: CnpjService,
		private readonly fileService: FileService,
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
				return {
					...weekday,
					end,
					start,
				};
			}),
		);

		// const { coverImagePath, logoImagePath } = await this.handleCoverLogoImages(
		// 	input.coverImage,
		// 	input.logoImage,
		// );

		// const banners = await this.handleBanners(input.banners);

		return this.formatRegisterTenantProps(
			input,
			zipcodeInfos,
			corporateReason,
			// coverImagePath,
			// logoImagePath,
			openingHours,
			// banners,
			plan,
		);
	}

	// private async handleBanners(
	// 	banners: BannerInput[],
	// ): Promise<RegisterTenantBannerProps[]> {
	// 	this.validateBanners(banners);

	// 	const createdBanners: RegisterTenantBannerProps[] = await Promise.all(
	// 		banners.map(async ({ image, active }) => {
	// 			const bannerPath = (await this.fileService.upload(image,)).fullPath;
	// 			return { imagePath: bannerPath, active };
	// 		}),
	// 	);

	// 	return createdBanners;
	// }

	// private validateBanners(banners: BannerInput[]) {
	// 	const bannersErrors: BannersErrors[] = [];

	// 	for (const { image } of banners) {
	// 		if (!this.allowedMimeTypes.includes(image.mimetype)) {
	// 			bannersErrors.push({
	// 				name: image.originalname,
	// 				errors: [ErrorMessages.invalidMimetype(image.mimetype)],
	// 			});
	// 		}

	// 		if (image.size > this.maxSizeInBytes) {
	// 			for (const bannerError of bannersErrors) {
	// 				if (bannerError.name === image.originalname) {
	// 					bannerError.errors.push(ErrorMessages.FILE_LIMIT_EXCEEDED);
	// 				}
	// 			}
	// 		}
	// 	}

	// 	if (bannersErrors.length > 0) {
	// 		throw new BadRequestError(
	// 			`Os seguintes banners estão inválidos: \n ${JSON.stringify(bannersErrors)}`,
	// 		);
	// 	}
	// }

	// private async handleCoverLogoImages(
	// 	coverImage: UploadFile | undefined,
	// 	logoImage: UploadFile | undefined,
	// ): Promise<Record<'coverImagePath' | 'logoImagePath', string | null>> {
	// 	const [coverImagePath, logoImagePath] = await Promise.all([
	// 		coverImage ? this.uploadImage(coverImage) : null,
	// 		logoImage ? this.uploadImage(logoImage) : null,
	// 	]);

	// 	return { coverImagePath, logoImagePath };
	// }

	// private async uploadImage(image: UploadFile): Promise<string> {
	// 	this.validateImages(image);
	// 	return (await this.fileService.upload(image)).fullPath;
	// }

	// private validateImages(image: UploadFile) {
	// 	if (!this.allowedMimeTypes.includes(image.mimetype)) {
	// 		throw new BadRequestError(ErrorMessages.invalidMimetype(image.mimetype));
	// 	}

	// 	if (image.size > this.maxSizeInBytes) {
	// 		throw new BadRequestError(ErrorMessages.FILE_LIMIT_EXCEEDED);
	// 	}
	// }

	private formatRegisterTenantProps(
		input: Input,
		zipcodeInfos: ZipcodeServiceResponse,
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
			state: zipcodeInfos.state,
			uf: zipcodeInfos.uf,
			city: zipcodeInfos.city,
			neighborhood: zipcodeInfos.neighborhood,
			street: zipcodeInfos.street,
			streetNumber: input.streetNumber,
			zipcode: input.zipcode,
			mainColor: input.mainColor,
			// coverImagePath,
			// logoImagePath,
			// banners,
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
