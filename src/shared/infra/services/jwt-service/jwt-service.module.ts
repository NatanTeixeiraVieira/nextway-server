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
			provide: JwtNestjsService,
			useFactory: (jwtService: JwtService) => {
				return new JwtNestjsService(jwtService);
			},
			inject: [JwtService],
		},
	],
	exports: [JwtNestjsService],
})
export class JwtServiceModule {}
