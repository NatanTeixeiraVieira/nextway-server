import { EnvConfig } from '@/shared/application/env-config/env-config';
import { JwtService } from '@/shared/application/services/jwt.service';
import { Module } from '@nestjs/common';
import { EnvConfigService } from '../../env-config/env-config.service';
import { JwtServiceModule } from '../jwt-service/jwt-service.module';
import { JwtNestjsService } from '../jwt-service/nestjs/jwt-nestjs.service';
import { AuthAppJwtService } from './app-jwt-service/auth-app-jwt-service.service';

@Module({
	imports: [JwtServiceModule],
	providers: [
		{
			provide: AuthAppJwtService,
			useFactory: (jwtService: JwtService, envConfigService: EnvConfig) => {
				return new AuthAppJwtService(jwtService, envConfigService);
			},
			inject: [JwtNestjsService, EnvConfigService],
		},
	],
	exports: [AuthAppJwtService],
})
export class AuthServiceModule {}
