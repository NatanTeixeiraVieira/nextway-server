import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtNestjsService } from './nestjs/jwt-nestjs.service';

@Module({
	imports: [
		JwtModule.registerAsync({
			useFactory: async () => ({
				global: true,
			}),
		}),
	],
	providers: [JwtNestjsService],
})
export class JwtServiceModule {}
