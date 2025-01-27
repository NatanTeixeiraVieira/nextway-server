import { ApiProperty } from '@nestjs/swagger';

export class VerifyRecoverPasswordTokenDto {
	@ApiProperty({ description: 'Recover password token' })
	token: string;
}
