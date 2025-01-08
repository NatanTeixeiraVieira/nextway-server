import { DocResponse } from '@/shared/infra/decorators';
import { applyDecorators } from '@nestjs/common';

export function UserLogoutDocResponse() {
	return applyDecorators(
		DocResponse({
			operation: {
				summary: 'It realizes the user logout',
			},
			success: {
				status: 200,
				type: undefined,
			},
		}),
	);
}
