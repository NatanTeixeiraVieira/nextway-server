import { Schema } from '@/shared/infra/database/typeorm/schemas/schema';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CardSchema } from './card.schema';

enum TenantPaymentStatus {
	PAID = 'PAID',
	PENDING = 'PENDING',
	FAILED = 'FAILED',
	CANCELED = 'CANCELED',
}

@Entity('tenant-payment')
export class TenantPaymentSchema extends Schema {
	@Column({
		name: 'price',
		type: 'decimal',
		precision: 6,
		scale: 2,
		nullable: false,
	})
	price: number;

	@Column({ name: 'currency', type: 'varchar', length: 3, nullable: false })
	currency: string;

	@Column({
		name: 'status',
		type: 'enum',
		enum: TenantPaymentStatus,
		nullable: false,
	})
	status: TenantPaymentStatus;

	@Column({ name: 'next_due_date', type: 'timestamp', nullable: true })
	nextDueDate: Date | null;

	@JoinColumn({ name: 'card_id' })
	@ManyToOne(
		() => CardSchema,
		(card) => card.tenantPaymentSchemas,
	)
	card: CardSchema;

	@Column({ name: 'tenant_id', type: 'uuid', nullable: false })
	tenantId: string;
}
