import { DocResponse } from '@/shared/infra/decorators';
import { applyDecorators } from '@nestjs/common';
import { RegisterTenantPresenter } from '../presenters/register-tenant.presenter';

export function UserRegisterDocResponse() {
	return applyDecorators(
		DocResponse({
			operation: {
				summary: 'It registers a tenant account',
			},
			success: {
				status: 201,
				type: RegisterTenantPresenter,
			},
			responses: [
				// {
				// 	status: 400,
				// 	description:
				// 		'It happens when some properties of provided input is invalid OR when email already exists',
				// },
				{
					status: 422,
					description: 'Invalid request body',
				},
			],
		}),
	);
}
