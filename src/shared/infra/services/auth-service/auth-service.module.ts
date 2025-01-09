import { Providers } from '@/shared/application/constants/providers';
import { EnvConfig } from '@/shared/application/env-config/env-config';
import { JwtService } from '@/shared/application/services/jwt.service';
import { Module } from '@nestjs/common';
import { JwtServiceModule } from '../jwt-service/jwt-service.module';
import { AuthAppJwtService } from './app-jwt-service/auth-app-jwt-service.service';

@Module({
	imports: [JwtServiceModule],
	providers: [
		{
			provide: Providers.AUTH_SERVICE,
			useFactory: (jwtService: JwtService, envConfigService: EnvConfig) => {
				return new AuthAppJwtService(jwtService, envConfigService);
			},
			inject: [Providers.JWT_SERVICE, Providers.ENV_CONFIG_SERVICE],
		},
	],
	exports: [Providers.AUTH_SERVICE],
})
export class AuthServiceModule {}
