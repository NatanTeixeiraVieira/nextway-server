import { DocResponse } from '@/shared/infra/decorators';
import { applyDecorators } from '@nestjs/common';
import { VerifyRecoverPasswordTokenPresenter } from '../presenters/verify-recover-password-token.presenter';

export function VerifyRecoverPasswordTokenDocResponse() {
	return applyDecorators(
		DocResponse({
			operation: {
				summary: 'It verify recover password token',
			},
			success: {
				status: 200,
				type: VerifyRecoverPasswordTokenPresenter,
			},
		}),
	);
}
