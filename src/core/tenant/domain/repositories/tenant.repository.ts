import { Repository } from '@/shared/domain/repositories/repository';
import { Tenant } from '../entities/tenant.entity';

export interface TenantRepository extends Repository<Tenant> {
	// getByEmail(email: string): Promise<Tenant | null>;
}
