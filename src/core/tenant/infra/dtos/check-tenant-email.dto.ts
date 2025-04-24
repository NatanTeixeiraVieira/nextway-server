import { ApiProperty } from '@nestjs/swagger';

export class CheckTenantEmailDto {
	@ApiProperty({ name: 'Tenant account email' })
	email: string;

	@ApiProperty({ name: 'Tenant email verification code' })
	verifyEmailCode: string;
}
