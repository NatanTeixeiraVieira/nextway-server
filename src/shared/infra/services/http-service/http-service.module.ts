import { Providers } from '@/shared/application/constants/providers';
import { HttpService as HttpNestjsService } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { HttpNestjsAxiosService } from './nestjs-axios/nestjs-axios.service';

@Module({
	providers: [
		{
			provide: Providers.HASH_SERVICE,
			useFactory: (httpService: HttpNestjsService) => {
				return new HttpNestjsAxiosService(httpService);
			},
			inject: [Providers.HTTP_SERVICE],
		},
	],
})
export class HttpServiceModule {}
