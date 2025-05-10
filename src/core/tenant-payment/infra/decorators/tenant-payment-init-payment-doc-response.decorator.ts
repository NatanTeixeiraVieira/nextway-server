import {
	applyDecorators,
	DocResponse,
	HttpStatus,
} from '@/shared/infra/decorators';
import { InitTenantPaymentPresenter } from '../presenters/init-tenant-payment.presenter';

export function TenantPaymentInitPaymentDocResponse() {
	return applyDecorators(
		DocResponse({
			operation: {
				summary: 'It inits the tenant payment with status PENDING',
			},
			success: {
				status: HttpStatus.OK,
				type: InitTenantPaymentPresenter,
			},
			responses: [
				{
					status: HttpStatus.BAD_REQUEST,
					description: 'It happens when logged tenant is not found',
				},
				{
					status: 422,
					description: 'Invalid request body',
				},
			],
		}),
	);
}
