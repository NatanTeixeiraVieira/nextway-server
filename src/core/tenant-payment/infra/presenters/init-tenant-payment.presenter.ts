import { ApiProperty } from '@nestjs/swagger';
import { Output } from '../../application/usecases/init-tenant-payment.usecase';

export class InitTenantPaymentPresenter {
	@ApiProperty({
		description:
			'Init url that redirects to payment gateway to create signature',
	})
	readonly initUrl: string;

	constructor(output: Output) {
		this.initUrl = output.initUrl;
	}
}
