import { ConfigService } from '@nestjs/config';
import { EnvConfig } from 'src/shared/application/env-config/env-config';

export class EnvConfigService implements EnvConfig {
	constructor(private readonly configService: ConfigService) {}

	getPort(): number {
		return Number(this.configService.get<number>('PORT'));
	}
}
