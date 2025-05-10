import { Column, Entity, OneToMany } from 'typeorm';
import { Schema } from '../../../../../../shared/infra/database/typeorm/schemas/schema';
import { TenantPaymentSchema } from './tenant-payment.schema';

@Entity('tenant_card')
export class CardSchema extends Schema {
	@Column({
		name: 'token',
		type: 'varchar',
		length: 255,
		unique: true,
		nullable: false,
	})
	token: string;

	@Column({ name: 'last_digits', type: 'varchar', length: 4, nullable: false })
	lastDigits: string;

	@Column({ name: 'brand', type: 'varchar', length: 30, nullable: false })
	brand: string;

	@Column({ name: 'active', type: 'boolean', default: true })
	active: boolean;

	@OneToMany(
		() => TenantPaymentSchema,
		(tenantPayment) => tenantPayment.card,
	)
	tenantPaymentSchemas: TenantPaymentSchema[];

	@Column({ name: 'tenant_id', type: 'uuid', nullable: false })
	tenantId: string;
}
