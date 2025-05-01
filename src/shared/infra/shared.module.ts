import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Providers } from '../application/constants/providers';
import { PlanTypeOrmQuery } from './database/typeorm/queries/plan.query';
import { PlanSchema } from './database/typeorm/schemas/plan.schema';

@Module({
	imports: [TypeOrmModule.forFeature([PlanSchema])],
	providers: [{ provide: Providers.PLAN_QUERY, useClass: PlanTypeOrmQuery }],
	exports: [Providers.PLAN_QUERY],
})
export class SharedModule {}
