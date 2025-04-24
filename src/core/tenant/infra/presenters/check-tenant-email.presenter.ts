import { ApiProperty } from '@nestjs/swagger';
import { Output } from '../../application/usecases/register-tenant.usecase';

export class CheckTenantEmailPresenter {
	@ApiProperty({ description: 'Checked email' })
	readonly email: string;

	constructor(output: Output) {
		this.email = output.email;
	}
}
