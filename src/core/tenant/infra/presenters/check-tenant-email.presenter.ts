import { ApiProperty } from '@nestjs/swagger';
import { Output } from '../../application/usecases/register-tenant.usecase';

export class CheckTenantEmailPresenter {
	@ApiProperty({ description: 'Tenant ID' })
	readonly id: string;

	@ApiProperty({ description: 'Checked email' })
	readonly email: string;

	constructor(output: Output) {
		this.id = output.id;
		this.email = output.email;
	}
}
