import { DocResponse } from '@/shared/infra/decorators';
import { applyDecorators } from '@nestjs/common';
import { CheckEmailPresenter } from '../presenters/check-email.presenter';

export function UserCheckEmailDocResponse() {
	return applyDecorators(
		DocResponse({
			operation: {
				summary: 'It checks user email',
			},
			success: {
				status: 201,
				type: CheckEmailPresenter,
			},
			responses: [
				{
					status: 404,
					description:
						'It happens when user is not found by user ID in the check email token',
				},
				{
					status: 401,
					description:
						'It happens when the provided check email token is invalid',
				},
			],
		}),
	);
}
