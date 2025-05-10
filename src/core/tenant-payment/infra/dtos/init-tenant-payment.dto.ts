import { ApiProperty } from '@nestjs/swagger';

export class InitTenantPaymentDto {
	@ApiProperty({ name: 'Card token, provided by payment gateway' })
	cardToken: string;

	@ApiProperty({ name: 'Card lasts 4 digits' })
	cardLastDigits: string;

	@ApiProperty({ name: 'Card brand: Visa, Mastercard, Elo...' })
	cardBrand: string;

	@ApiProperty({ name: 'Credit card owner email' })
	payerEmail: string;

	@ApiProperty({ name: 'Credit card owner name' })
	payerName: string;

	@ApiProperty({ name: 'Credit card owner document. Can be CPF or CNPJ' })
	payerDocument: string;
}
