import { TenantProviders } from '@/core/tenant/application/constants/providers';
import { Providers } from '@/shared/application/constants/providers';
import { CityQuery } from '@/shared/application/queries/city.query';
import { PlanQuery } from '@/shared/application/queries/plan.query';
import { StateQuery } from '@/shared/application/queries/state.query';
import { AuthService } from '@/shared/application/services/auth.service';
import { CnpjService } from '@/shared/application/services/cnpj.service';
import { MailService } from '@/shared/application/services/mail.service';
import { ZipcodeService } from '@/shared/application/services/zipcode.service';
import { UnitOfWork } from '@/shared/application/unit-of-work/unit-of-work';
import { AuthServiceModule } from '@/shared/infra/services/auth-service/auth-service.module';
import { CnpjServiceModule } from '@/shared/infra/services/cnpj-service/cnpj-service.module';
import { MailServiceModule } from '@/shared/infra/services/mail-service/mail-service.module';
import { ZipcodeModule } from '@/shared/infra/services/zipcode-service/zipcode.module';
import { SharedModule } from '@/shared/infra/shared.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CitySchema } from '../../../shared/infra/database/typeorm/schemas/city.schema';
import { PlanSchema } from '../../../shared/infra/database/typeorm/schemas/plan.schema';
import { StateSchema } from '../../../shared/infra/database/typeorm/schemas/state.schema';
import { TenantOutputMapper } from '../application/outputs/tenant-output';
import { TenantQuery } from '../application/queries/tenant.query';
import { CheckTenantEmailUseCase } from '../application/usecases/check-tenant-email.usecase';
import { handleFinishedPaymentUseCase } from '../application/usecases/handle-finished-payment.usecase';
import { RegisterTenantUseCase } from '../application/usecases/register-tenant.usecase';
import { TenantRepository } from '../domain/repositories/tenant.repository';
import { TenantController } from './controllers/tenant.controller';
import { TenantTypeOrmQuery } from './database/typeorm/queries/tenant-typeorm.query';
import { TenantTypeormRepositoryMapper } from './database/typeorm/repositories/tenant-typeorm-repository-mapper';
import { TenantTypeOrmRepository } from './database/typeorm/repositories/tenant-typeorm.repository';
import { TenantSchema } from './database/typeorm/schemas/tenant.schema';
import { WeekdaySchema } from './database/typeorm/schemas/weekday.schema';

@Module({
	imports: [
		TypeOrmModule.forFeature([
			TenantSchema,
			WeekdaySchema,
			StateSchema,
			CitySchema,
			PlanSchema,
		]),
		SharedModule,
		ZipcodeModule,
		CnpjServiceModule,
		MailServiceModule,
		AuthServiceModule,
	],
	controllers: [TenantController],
	providers: [
		TenantTypeormRepositoryMapper,
		{
			provide: TenantProviders.TENANT_OUTPUT_MAPPER,
			useClass: TenantOutputMapper,
		},
		{
			provide: TenantProviders.TENANT_REPOSITORY,
			useClass: TenantTypeOrmRepository,
		},
		{
			provide: TenantProviders.TENANT_QUERY,
			useClass: TenantTypeOrmQuery,
		},

		{
			provide: RegisterTenantUseCase,
			useFactory: (
				uow: UnitOfWork,
				tenantRepository: TenantRepository,
				tenantQuery: TenantQuery,
				planQuery: PlanQuery,
				stateQuery: StateQuery,
				cityQuery: CityQuery,
				zipcodeService: ZipcodeService,
				cnpjService: CnpjService,
				tenantOutputMapper: TenantOutputMapper,
				mailService: MailService,
			) => {
				return new RegisterTenantUseCase(
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
			},
			inject: [
				Providers.UNIT_OF_WORK,
				TenantProviders.TENANT_REPOSITORY,
				TenantProviders.TENANT_QUERY,
				Providers.PLAN_QUERY,
				Providers.STATE_QUERY,
				Providers.CITY_QUERY,
				Providers.ZIPCODE_SERVICE,
				Providers.CNPJ_SERVICE,
				TenantProviders.TENANT_OUTPUT_MAPPER,
				Providers.MAIL_SERVICE,
			],
		},

		{
			provide: CheckTenantEmailUseCase,
			useFactory: (
				tenantRepository: TenantRepository,
				tenantOutputMapper: TenantOutputMapper,
				authService: AuthService,
			) => {
				return new CheckTenantEmailUseCase(
					tenantRepository,
					tenantOutputMapper,
					authService,
				);
			},
			inject: [
				TenantProviders.TENANT_REPOSITORY,
				TenantProviders.TENANT_OUTPUT_MAPPER,
				Providers.AUTH_SERVICE,
			],
		},

		{
			provide: handleFinishedPaymentUseCase,
			useFactory: (tenantRepository: TenantRepository) => {
				return new handleFinishedPaymentUseCase(tenantRepository);
			},
			inject: [TenantProviders.TENANT_REPOSITORY],
		},
	],
})
export class TenantModule {}
