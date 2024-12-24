import { Schema } from '@/shared/infra/database/typeorm/schemas/schema';
import { Column, Entity, Index } from 'typeorm';

@Entity('user')
@Index('UQ_user_email_active', ['email'], {
	unique: true,
	where: '"deleted_at" IS NULL',
})
export class UserSchema extends Schema {
	@Column({ type: 'varchar', length: 255, nullable: false })
	name: string;

	@Column({ type: 'varchar', length: 255, unique: true, nullable: false })
	email: string;

	@Column({ type: 'varchar', length: 100, nullable: false })
	password: string;

	@Column({ type: 'varchar', length: 13, nullable: true })
	phoneNumber: string | null;

	@Column({ type: 'timestamp', nullable: true })
	emailVerified: Date | null;

	@Column({ type: 'varchar', length: 255, nullable: true })
	forgotPasswordEmailVerificationToken: string | null;

	@Column({ type: 'boolean', default: false })
	active: boolean;
}
