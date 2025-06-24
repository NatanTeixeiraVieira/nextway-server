import { Providers } from '@/shared/application/constants/providers';
import { Global, Module } from '@nestjs/common';
import { UnitOfWorkTypeOrm } from './typeorm/unit-of-work-typeorm';

@Global()
@Module({
	imports: [],
	providers: [{ provide: Providers.UNIT_OF_WORK, useClass: UnitOfWorkTypeOrm }],
	exports: [Providers.UNIT_OF_WORK],
})
export class UnitOfWorkModule {}
