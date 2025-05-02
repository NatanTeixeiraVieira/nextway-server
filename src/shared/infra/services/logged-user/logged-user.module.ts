import { Providers } from '@/shared/application/constants/providers';
import { Module } from '@nestjs/common';
import { LoggedUserNestjsService } from './nestjs/logged-user.service';

@Module({
	providers: [
		{
			provide: Providers.LOGGED_USER_SERVICE,
			useClass: LoggedUserNestjsService,
		},
	],
	exports: [Providers.LOGGED_USER_SERVICE],
})
export class LoggedUserModule {}
