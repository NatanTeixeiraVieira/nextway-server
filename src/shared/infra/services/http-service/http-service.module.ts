import { Providers } from '@/shared/application/constants/providers';
import { HttpModule, HttpService as HttpNestjsService } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { HttpNestjsAxiosService } from './nestjs-axios/nestjs-axios.service';

@Module({
	imports: [HttpModule],
	providers: [
		{
			provide: Providers.HTTP_SERVICE,
			useFactory: (httpService: HttpNestjsService) => {
				return new HttpNestjsAxiosService(httpService);
			},
			inject: [HttpNestjsService],
		},
	],
	exports: [Providers.HTTP_SERVICE],
})
export class HttpServiceModule {}
