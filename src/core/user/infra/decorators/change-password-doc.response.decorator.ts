import { DocResponse } from '@/shared/infra/decorators';
import { applyDecorators } from '@nestjs/common';

export function ChangePasswordDocResponse() {
	return applyDecorators(
		DocResponse({
			operation: {
				summary: 'It changes user password',
			},
			success: {
				status: 204,
				type: undefined,
			},
			responses: [
				{
					status: 401,
					description:
						'It happens when the provided change password token is invalid',
				},
				{
					status: 404,
					description:
						'It happens when user is not found by ID in the change password token',
				},
			],
		}),
	);
}
