import { DocResponse } from '@/shared/infra/decorators';
import { applyDecorators } from '@nestjs/common';
import { RecoverPasswordSendEmailPresenter } from '../presenters/recover-password-send-email.presenter';

export function UserRecoverPasswordSendEmailDocResponse() {
	return applyDecorators(
		DocResponse({
			operation: {
				summary:
					'It sends a confirmation email to user with recover password token',
			},
			success: {
				status: 201,
				type: RecoverPasswordSendEmailPresenter,
			},
			responses: [
				{
					status: 400,
					description:
						'It happens when email is invalid OR user account is inactive',
				},
				{
					status: 404,
					description: 'It happens when user is not found',
				},
			],
		}),
	);
}
