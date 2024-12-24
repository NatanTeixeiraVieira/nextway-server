import {
	CreateDateColumn,
	DeleteDateColumn,
	PrimaryColumn,
	UpdateDateColumn,
} from 'typeorm';

export abstract class Schema {
	@PrimaryColumn('uuid')
	id: string;

	@CreateDateColumn({ name: 'created_at', type: 'timestamp' })
	createdAt: Date;

	@UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
	updatedAt: Date;

	@DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
	deletedAt: Date | null;
}
