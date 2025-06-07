import { Schema } from '@/shared/infra/database/typeorm/schemas/schema';
import { Column, Entity } from 'typeorm';

export enum TenantPaymentStatus {
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
		transformer: {
			to: (value: number) => value,
			from: (value: string) => Number.parseFloat(value),
		},
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

	@Column({ name: 'tenant_id', type: 'uuid', nullable: false })
	tenantId: string;
}
