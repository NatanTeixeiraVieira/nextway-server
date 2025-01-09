import { Providers } from '@/shared/application/constants/providers';
import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtNestjsService } from './nestjs/jwt-nestjs.service';

@Module({
	imports: [
		JwtModule.registerAsync({
			useFactory: async () => ({
				global: true,
			}),
		}),
	],
	providers: [
		{
			provide: Providers.JWT_SERVICE,
			useFactory: (jwtService: JwtService) => {
				return new JwtNestjsService(jwtService);
			},
			inject: [JwtService],
		},
	],
	exports: [Providers.JWT_SERVICE],
})
export class JwtServiceModule {}
