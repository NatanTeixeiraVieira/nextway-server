import { Providers } from '@/shared/application/constants/providers';
import { EnvConfig } from '@/shared/application/env-config/env-config';
import { HttpService } from '@/shared/application/services/http.service';
import { Module } from '@nestjs/common';
import { HttpServiceModule } from '../http-service/http-service.module';
import { ZipcodeAwesomeApiService } from './awesomeapi/zipcode-awesomeapi.service';

@Module({
	imports: [HttpServiceModule],
	providers: [
		{
			provide: Providers.ZIPCODE_SERVICE,
			useFactory: (httpService: HttpService, envConfigService: EnvConfig) => {
				return new ZipcodeAwesomeApiService(httpService, envConfigService);
			},
			inject: [Providers.HTTP_SERVICE, Providers.ENV_CONFIG_SERVICE],
		},
	],
	exports: [Providers.ZIPCODE_SERVICE],
})
export class ZipcodeModule {}
