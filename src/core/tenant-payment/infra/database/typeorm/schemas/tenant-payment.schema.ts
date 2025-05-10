import { TenantPaymentStatus } from '@/core/tenant-payment/domain/entities/tenant-payment.entity';
import { Schema } from '@/shared/infra/database/typeorm/schemas/schema';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CardSchema } from './card.schema';

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

	@JoinColumn({ name: 'card' })
	@ManyToOne(() => CardSchema)
	card: CardSchema;

	// @JoinColumn({ type: 'uuid', nullable: false })
	// tenant: string;
}
