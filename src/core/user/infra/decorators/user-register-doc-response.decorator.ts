import { DocResponse } from '@/shared/infra/decorators';
import { applyDecorators } from '@nestjs/common';
import { RegisterPresenter } from '../presenters/register.presenter';

export function UserRegisterDocResponse() {
	return applyDecorators(
		DocResponse({
			operation: {
				summary: 'It registers a user and send a confirmation email',
			},
			success: {
				status: 201,
				type: RegisterPresenter,
			},
			responses: [
				{
					status: 400,
					description:
						'It happens when some properties of provided input is invalid OR when email already exists',
				},
				{
					status: 422,
					description: 'Invalid request body',
				},
			],
		}),
	);
}
