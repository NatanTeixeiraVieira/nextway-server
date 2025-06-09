import { ApiProperty } from '@nestjs/swagger';

export class HandleFinishedPaymentDto {
	@ApiProperty({ description: 'Date and time when the event occurred' })
	readonly ocurredAt: Date;

	@ApiProperty({ description: 'Tenant ID that finished the payment' })
	readonly tenantId: string;

	@ApiProperty({ description: 'Next due date for the payment' })
	readonly nextDueDate: Date;
}
