import { Providers } from '@/shared/application/constants/providers';
import { EnvConfig } from '@/shared/application/env-config/env-config';
import {
	CanActivate,
	ExecutionContext,
	Inject,
	Injectable,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import * as crypto from 'node:crypto';

@Injectable()
export class PaymentGuard implements CanActivate {
	constructor(
		@Inject(Providers.ENV_CONFIG_SERVICE)
		private readonly envConfigService: EnvConfig,
	) {}

	canActivate(context: ExecutionContext): boolean {
		const request = context.switchToHttp().getRequest<FastifyRequest>();

		const xSignature = request.headers['x-signature'] as string;
		const xRequestId = request.headers['x-request-id'] as string;
		const query = request.query as Record<string, unknown>;
		const dataID = query['data.id'] as string;

		return this.validateSecretSignature(xSignature, xRequestId, dataID);
	}

	private validateSecretSignature(
		xSignature: string,
		xRequestId: string,
		dataID: string,
	): boolean {
		if (!xSignature || !xRequestId || !dataID) {
			console.error('Missing required headers or query param');
			return false;
		}

		const parts = xSignature.split(',');

		const { hash, ts } = this.getTsAndHash(parts);

		if (!ts || !hash) {
			console.error('Invalid signature format');
			return false;
		}

		const secret = this.envConfigService.getPaymentSecretSignature();
		const manifest = `id:${dataID};request-id:${xRequestId};ts:${ts};`;

		const hmac = crypto.createHmac('sha256', secret);
		hmac.update(manifest);
		const sha = hmac.digest('hex');

		const isValid = sha === hash;

		return isValid;
	}

	private getTsAndHash(
		parts: string[],
	): Record<'ts' | 'hash', string | undefined> {
		let ts: string | undefined;
		let hash: string | undefined;

		for (const part of parts) {
			const [key, value] = part.split('=');
			if (key && value) {
				const trimmedKey = key.trim();
				const trimmedValue = value.trim();
				if (trimmedKey === 'ts') {
					ts = trimmedValue;
				} else if (trimmedKey === 'v1') {
					hash = trimmedValue;
				}
			}
		}

		return { ts, hash };
	}
}
