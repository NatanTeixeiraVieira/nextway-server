import {
	GenerateJwtToken,
	JwtGenerateOptions,
	JwtService,
	JwtVerifyOptions,
	Payload,
} from '@/shared/application/services/jwt.service';
import { JwtService as NestjsJwtService } from '@nestjs/jwt';

export class JwtNestjsService implements JwtService {
	constructor(private readonly jwtService: NestjsJwtService) {}

	async generateJwt<P extends Payload>(
		payload: P,
		options: JwtGenerateOptions,
	): Promise<GenerateJwtToken> {
		const jwtToken = await this.jwtService.signAsync(payload, options);

		return { token: jwtToken };
	}

	async verifyJwt(token: string, options: JwtVerifyOptions): Promise<boolean> {
		try {
			await this.jwtService.verifyAsync(token, options);
			return true;
		} catch (_error) {
			return false;
		}
	}

	async decodeJwt<P extends Payload>(token: string): Promise<P> {
		return await this.jwtService.decode(token);
	}
}
