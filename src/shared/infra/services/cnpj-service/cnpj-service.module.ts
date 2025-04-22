import { Providers } from '@/shared/application/constants/providers';
import { EnvConfig } from '@/shared/application/env-config/env-config';
import { HttpService } from '@/shared/application/services/http.service';
import { Module } from '@nestjs/common';
import { HttpServiceModule } from '../http-service/http-service.module';
import { CnpjReceitawsService } from './receitaws/cnpj-receitaws.service';

@Module({
	imports: [HttpServiceModule],
	providers: [
		{
			provide: Providers.CNPJ_SERVICE,
			useFactory: (httpService: HttpService, envConfigService: EnvConfig) => {
				return new CnpjReceitawsService(httpService, envConfigService);
			},
			inject: [Providers.HTTP_SERVICE, Providers.ENV_CONFIG_SERVICE],
		},
	],
	exports: [Providers.CNPJ_SERVICE],
})
export class CnpjServiceModule {}
