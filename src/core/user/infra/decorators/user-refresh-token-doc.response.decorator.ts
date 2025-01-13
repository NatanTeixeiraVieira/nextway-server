import { DocResponse } from '@/shared/infra/decorators';
import { applyDecorators } from '@nestjs/common';

export function UserRefreshTokenDocResponse() {
	return applyDecorators(
		DocResponse({
			operation: {
				summary:
					'It realizes the refresh of user access token, generating a new access token',
			},
			success: {
				status: 200,
				type: undefined,
			},
			responses: [
				{
					status: 401,
					description:
						'It happens when the provided refresh token is invalid or expired',
				},
			],
		}),
	);
}
