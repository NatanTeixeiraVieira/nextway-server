import { ApiProperty } from '@nestjs/swagger';
import { Output } from '../../application/usecases/init-tenant-payment.usecase';

export class InitTenantPaymentPresenter {
	@ApiProperty({ description: 'Tenant payment ID' })
	readonly id: string;

	constructor(output: Output) {
		this.id = output.id;
	}
}
