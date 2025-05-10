import { Providers } from '@/shared/application/constants/providers';
import { PlanQuery } from '@/shared/application/queries/plan.query';
import { CardService } from '@/shared/application/services/card.service';
import { LoggedTenantService } from '@/shared/application/services/logged-tenant.service';
import { PlanPaymentService } from '@/shared/application/services/plan-payment.service';
import { CardServiceModule } from '@/shared/infra/services/card-service/card-service.module';
import { PlanPaymentServiceModule } from '@/shared/infra/services/plan-payment-service/plan-payment-service.module';
import { SharedModule } from '@/shared/infra/shared.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantPaymentProviders } from '../application/constants/providers';
import { TenantPaymentOutputMapper } from '../application/outputs/tenant-payment-output';
import { InitTenantPaymentUseCase } from '../application/usecases/init-tenant-payment.usecase';
import { TenantPaymentRepository } from '../domain/repositories/tenant-payment.repository';
import { TenantPaymentController } from './controllers/tenant-payment.controller';
import { TenantPaymentTypeormRepositoryMapper } from './database/typeorm/repositories/tenant-payment-typeorm-repository-mapper';
import { TenantPaymentTypeOrmRepository } from './database/typeorm/repositories/tenant-payment-typeorm.repository';
import { CardSchema } from './database/typeorm/schemas/card.schema';
import { TenantPaymentSchema } from './database/typeorm/schemas/tenant-payment.schema';

@Module({
	imports: [
		PlanPaymentServiceModule,
		CardServiceModule,
		SharedModule,
		TypeOrmModule.forFeature([TenantPaymentSchema, CardSchema]),
	],
	controllers: [TenantPaymentController],
	providers: [
		TenantPaymentTypeormRepositoryMapper,
		{
			provide: TenantPaymentProviders.TENANT_PAYMENT_OUTPUT_MAPPER,
			useClass: TenantPaymentOutputMapper,
		},
		{
			provide: TenantPaymentProviders.TENANT_PAYMENT_REPOSITORY,
			useClass: TenantPaymentTypeOrmRepository,
		},
		{
			provide: InitTenantPaymentUseCase,
			useFactory: (
				planPaymentService: PlanPaymentService,
				cardService: CardService,
				planQuery: PlanQuery,
				tenantPaymentRepository: TenantPaymentRepository,
				loggedTenantService: LoggedTenantService,
				tenantPaymentOutputMapper: TenantPaymentOutputMapper,
			) => {
				return new InitTenantPaymentUseCase(
					planPaymentService,
					cardService,
					planQuery,
					tenantPaymentRepository,
					loggedTenantService,
					tenantPaymentOutputMapper,
				);
			},
			inject: [
				Providers.PLAN_PAYMENT_SERVICE,
				Providers.CARD_SERVICE,
				Providers.PLAN_QUERY,
				TenantPaymentProviders.TENANT_PAYMENT_REPOSITORY,
				Providers.LOGGED_TENANT_SERVICE,
				TenantPaymentProviders.TENANT_PAYMENT_OUTPUT_MAPPER,
			],
		},
	],
})
export class TenantPaymentModule {}
