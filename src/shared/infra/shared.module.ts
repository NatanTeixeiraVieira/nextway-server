import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Providers } from '../application/constants/providers';
import { PlanTypeOrmQuery } from './database/typeorm/queries/plan.query';
import { StateTypeOrmQuery } from './database/typeorm/queries/state.query';
import { PlanSchema } from './database/typeorm/schemas/plan.schema';
import { StateSchema } from './database/typeorm/schemas/state.schema';

@Module({
	imports: [TypeOrmModule.forFeature([PlanSchema, StateSchema])],
	providers: [
		{ provide: Providers.PLAN_QUERY, useClass: PlanTypeOrmQuery },
		{ provide: Providers.STATE_QUERY, useClass: StateTypeOrmQuery },
	],
	exports: [Providers.PLAN_QUERY, Providers.STATE_QUERY],
})
export class SharedModule {}
