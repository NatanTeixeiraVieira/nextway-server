import { DocResponse } from '@/shared/infra/decorators';
import { applyDecorators } from '@nestjs/common';
import { LoginPresenter } from '../presenters/login.presenter';

export function UserLoginDocResponse() {
	return applyDecorators(
		DocResponse({
			operation: {
				summary: 'It realizes the user login',
			},
			success: {
				status: 201,
				type: LoginPresenter,
			},
			responses: [
				{
					status: 400,
					description:
						'It happens when some properties of provided input is invalid OR when user is not found by provided email',
				},
				{
					status: 422,
					description: 'Invalid request body',
				},
			],
		}),
	);
}
