import { TenantPayment } from '@/core/tenant-payment/domain/entities/tenant-payment.entity';
import { TenantPaymentRepository } from '@/core/tenant-payment/domain/repositories/tenant-payment.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TenantPaymentSchema } from '../schemas/tenant-payment.schema';
import { TenantPaymentTypeormRepositoryMapper } from './tenant-payment-typeorm-repository-mapper';

export class TenantPaymentTypeOrmRepository implements TenantPaymentRepository {
	constructor(
		@InjectRepository(TenantPaymentSchema)
		private readonly tenantPaymentRepository: Repository<TenantPaymentSchema>,
		private readonly tenantPaymentRepositoryMapper: TenantPaymentTypeormRepositoryMapper,
	) {}

	async getById(id: string): Promise<TenantPayment | null> {
		const relations = this.getAllRelations();

		const tenantSchema = await this.tenantPaymentRepository.findOne({
			relations,
			where: { id },
		});

		if (!tenantSchema) return null;

		return this.tenantPaymentRepositoryMapper.toEntity(tenantSchema);
	}

	async create(entity: TenantPayment): Promise<void> {
		const tenantSchema = this.tenantPaymentRepositoryMapper.toSchema(entity);
		await this.tenantPaymentRepository.insert(tenantSchema);
	}

	async update(entity: TenantPayment): Promise<void> {
		const tenantSchema = this.tenantPaymentRepositoryMapper.toSchema(entity);
		await this.tenantPaymentRepository.save(tenantSchema);
	}

	private getAllRelations(): string[] {
		const firstRelations = this.tenantPaymentRepository.metadata.relations.map(
			(rel) => rel.propertyName,
		);

		return [...firstRelations];
	}
}
