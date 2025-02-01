import { ApiProperty } from '@nestjs/swagger';
import { MinLength } from 'class-validator';

export class ChangePasswordDto {
	@ApiProperty({ description: 'Change password verification token' })
	readonly changePasswordToken: string;

	@ApiProperty({
		description: 'New user password, sent to replace the previous password',
	})
	@MinLength(8)
	readonly password: string;
}
