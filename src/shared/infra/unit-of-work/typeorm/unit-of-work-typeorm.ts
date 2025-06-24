import { UnitOfWork } from '@/shared/application/unit-of-work/unit-of-work';
import { Transactional } from '@/shared/infra/database/typeorm/decorators/transactional.decorator';

export class UnitOfWorkTypeOrm implements UnitOfWork {
	@Transactional()
	async execute<T>(work: () => Promise<T>): Promise<T> {
		return await work();
	}

	// It also works
	// constructor(private readonly dataSource: DataSource) {}
	// async execute<T>(work: () => Promise<T>): Promise<T> {
	// 	const queryRunner = this.dataSource.createQueryRunner();
	// 	await queryRunner.connect();
	// 	await queryRunner.startTransaction();

	// 	try {
	// 		const result = await work();
	// 		await queryRunner.commitTransaction();
	// 		return result;
	// 	} catch (err) {
	// 		await queryRunner.rollbackTransaction();
	// 		throw err;
	// 	} finally {
	// 		await queryRunner.release();
	// 	}
	// }
}
