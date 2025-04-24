import { Tenant } from '@/core/tenant/domain/entities/tenant.entity';
import { TenantRepository } from '@/core/tenant/domain/repositories/tenant.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TenantSchema } from '../schemas/tenant.schema';
import { TenantTypeormRepositoryMapper } from './tenant-typeorm-repository-mapper';

export class TenantTypeOrmRepository implements TenantRepository {
	constructor(
		@InjectRepository(TenantSchema)
		private readonly tenantRepository: Repository<TenantSchema>,
		private readonly tenantRepositoryMapper: TenantTypeormRepositoryMapper,
	) {}

	async getById(id: string): Promise<Tenant | null> {
		const tenantSchema = await this.tenantRepository.findOneBy({ id });

		if (!tenantSchema) return null;

		return this.tenantRepositoryMapper.toEntity(tenantSchema);
	}

	async getByEmail(email: string): Promise<Tenant | null> {
		const tenantSchema = await this.tenantRepository.findOneBy({ email });

		if (!tenantSchema) return null;

		return this.tenantRepositoryMapper.toEntity(tenantSchema);
	}

	async create(entity: Tenant): Promise<void> {
		const tenantSchema = this.tenantRepositoryMapper.toSchema(entity);
		await this.tenantRepository.insert(tenantSchema);
	}

	async update(entity: Tenant): Promise<void> {
		const tenantSchema = this.tenantRepositoryMapper.toSchema(entity);
		await this.tenantRepository.save(tenantSchema);
	}

	async delete(entity: Tenant): Promise<void> {
		entity.deleteAccount();
		const tenantSchema = this.tenantRepositoryMapper.toSchema(entity);
		await this.tenantRepository.save(tenantSchema);
	}

	async hardDelete(id: string): Promise<void> {
		await this.tenantRepository.delete({ id });
	}
}
