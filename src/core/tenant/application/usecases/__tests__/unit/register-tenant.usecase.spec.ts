import { TenantRepository } from '@/core/tenant/domain/repositories/tenant.repository';
import { ErrorMessages } from '@/shared/application/error-messages/error-messages';
import { BadRequestError } from '@/shared/application/errors/bad-request-error';
import { ConflictError } from '@/shared/application/errors/conflict-error';
import { CityQuery } from '@/shared/application/queries/city.query';
import { PlanQuery } from '@/shared/application/queries/plan.query';
import { StateQuery } from '@/shared/application/queries/state.query';
import { CnpjService } from '@/shared/application/services/cnpj.service';
import { MailService } from '@/shared/application/services/mail.service';
import { ZipcodeService } from '@/shared/application/services/zipcode.service';
import { UnitOfWork } from '@/shared/application/unit-of-work/unit-of-work';
import { TenantOutputMapper } from '../../../outputs/tenant-output';
import { TenantQuery } from '../../../queries/tenant.query';
import { RegisterTenantUseCase } from '../../register-tenant.usecase';

jest.mock('@/core/tenant/domain/entities/tenant.entity.ts', () => ({
	Tenant: {
		registerTenant: jest.fn(),
	},
}));

describe('RegisterTenantUseCase', () => {
	let sut: RegisterTenantUseCase;
	let uow: UnitOfWork;
	let tenantRepository: TenantRepository;
	let tenantQuery: TenantQuery;
	let planQuery: PlanQuery;
	let stateQuery: StateQuery;
	let cityQuery: CityQuery;
	let zipcodeService: ZipcodeService;
	let cnpjService: CnpjService;
	let tenantOutputMapper: TenantOutputMapper;
	let mailService: MailService;

	const input = {
		zipcode: '12345678',
		streetName: 'Main St',
		neighborhood: 'Centro',
		streetNumber: '100',
		responsibleName: 'John Doe',
		responsibleCpf: '42417261006',
		responsiblePhoneNumber: '5511999999999',
		cnpj: '58371556000174',
		establishmentName: 'My Store',
		establishmentPhoneNumber: '5511999999999',
		slug: 'my-store',
		email: 'john@store.com',
		password: 'securePass123',
	};

	const zipcodeInfos = {
		state: 'Paraná',
		city: 'Curitiba',
		location: {
			coordinates: {
				longitude: '10.1',
				latitude: '20.2',
			},
		},
	} as any;

	const plan = {
		id: 'plan-id',
		name: 'Basic',
		price: 100,
		active: true,
	} as any;
	const cnpjInfos = { corporateReason: 'My Store Ltda' };
	const state = { id: 'state-id', name: 'Paraná', uf: 'PR' };
	const city = { id: 'city-id', name: 'Curitiba' };

	const tenantMock = { id: 'tenant-id', email: input.email };

	beforeEach(() => {
		uow = { execute: jest.fn((fn) => fn()) } as any;
		tenantRepository = {
			create: jest.fn(),
			hardDelete: jest.fn(),
		} as any;
		tenantQuery = {
			isEmailVerified: jest.fn().mockResolvedValue(false),
			cnpjExists: jest.fn().mockResolvedValue(false),
			slugExists: jest.fn().mockResolvedValue(false),
			getInactiveUserIdByEmail: jest.fn().mockResolvedValue(null),
		} as any;
		planQuery = { getPlan: jest.fn().mockResolvedValue(plan) } as any;
		stateQuery = {
			getOneStateByName: jest.fn().mockResolvedValue(state),
		} as any;
		cityQuery = { getOneCityByName: jest.fn().mockResolvedValue(city) } as any;
		zipcodeService = {
			getInfosByZipcode: jest.fn().mockResolvedValue(zipcodeInfos),
		} as any;
		cnpjService = {
			getInfosByCnpj: jest.fn().mockResolvedValue(cnpjInfos),
		} as any;
		tenantOutputMapper = {
			toOutput: jest.fn().mockReturnValue({ id: 'tenant-id' }),
		} as any;
		mailService = { sendMail: jest.fn().mockResolvedValue(undefined) } as any;

		(
			require('@/core/tenant/domain/entities/tenant.entity.ts') as any
		).Tenant.registerTenant.mockReturnValue(tenantMock);

		sut = new RegisterTenantUseCase(
			uow,
			tenantRepository,
			tenantQuery,
			planQuery,
			stateQuery,
			cityQuery,
			zipcodeService,
			cnpjService,
			tenantOutputMapper,
			mailService,
		);
	});

	it('should register a tenant successfully', async () => {
		const output = await sut.execute(input);

		expect(tenantQuery.isEmailVerified).toHaveBeenCalledWith(input.email);
		expect(tenantQuery.cnpjExists).toHaveBeenCalledWith(input.cnpj);
		expect(tenantQuery.slugExists).toHaveBeenCalledWith(input.slug);
		expect(zipcodeService.getInfosByZipcode).toHaveBeenCalledWith(
			input.zipcode,
		);
		expect(planQuery.getPlan).toHaveBeenCalled();
		expect(cnpjService.getInfosByCnpj).toHaveBeenCalledWith(input.cnpj);
		expect(stateQuery.getOneStateByName).toHaveBeenCalledWith(
			zipcodeInfos.state,
		);
		expect(cityQuery.getOneCityByName).toHaveBeenCalledWith(zipcodeInfos.city);
		expect(tenantRepository.create).toHaveBeenCalledWith(tenantMock);
		expect(mailService.sendMail).toHaveBeenCalled();
		expect(tenantOutputMapper.toOutput).toHaveBeenCalledWith(tenantMock);
		expect(output).toEqual({ id: 'tenant-id' });
	});

	it('should throw ConflictError if email is already verified', async () => {
		(tenantQuery.isEmailVerified as jest.Mock).mockResolvedValue(true);

		await expect(sut.execute(input)).rejects.toThrow(
			new ConflictError(ErrorMessages.EMAIL_ALREADY_EXISTS),
		);
	});

	it('should throw ConflictError if cnpj already exists', async () => {
		(tenantQuery.cnpjExists as jest.Mock).mockResolvedValue(true);

		await expect(sut.execute(input)).rejects.toThrow(
			new ConflictError(ErrorMessages.CNPJ_ALREADY_EXISTS),
		);
	});

	it('should throw ConflictError if slug already exists', async () => {
		(tenantQuery.slugExists as jest.Mock).mockResolvedValue(true);

		await expect(sut.execute(input)).rejects.toThrow(
			new ConflictError(ErrorMessages.SLUG_ALREADY_EXISTS),
		);
	});

	it('should hard delete inactive tenant if found', async () => {
		(tenantQuery.getInactiveUserIdByEmail as jest.Mock).mockResolvedValue({
			id: 'inactive-id',
		});

		await sut.execute(input);

		expect(tenantRepository.hardDelete).toHaveBeenCalledWith('inactive-id');
	});

	it('should throw BadRequestError if cnpj infos not found', async () => {
		(cnpjService.getInfosByCnpj as jest.Mock).mockResolvedValue(null);

		await expect(sut.execute(input)).rejects.toThrow(
			new BadRequestError(ErrorMessages.cnpjNotFound(input.cnpj)),
		);
	});

	it('should throw BadRequestError if state not found', async () => {
		(stateQuery.getOneStateByName as jest.Mock).mockResolvedValue(null);

		await expect(sut.execute(input)).rejects.toThrow(
			new BadRequestError(ErrorMessages.stateNotFound(zipcodeInfos.state)),
		);
	});

	it('should throw BadRequestError if city not found', async () => {
		(cityQuery.getOneCityByName as jest.Mock).mockResolvedValue(null);

		await expect(sut.execute(input)).rejects.toThrow(
			new BadRequestError(ErrorMessages.stateNotFound(zipcodeInfos.city)),
		);
	});
});
