import { ApiProperty } from '@nestjs/swagger';
import { Output } from '../../application/usecases/register-tenant.usecase';

export class RegisterTenantPresenter {
	@ApiProperty({ description: 'Created tenant ID' })
	readonly id: string;

	constructor(output: Output) {
		this.id = output.id;
	}
}
