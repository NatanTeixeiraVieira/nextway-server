import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantSchema } from './database/typeorm/schemas/tenant.schema';
import { WeekdaySchema } from './database/typeorm/schemas/weekday.schema';

@Module({
	imports: [TypeOrmModule.forFeature([TenantSchema, WeekdaySchema])],
	controllers: [],
	providers: [],
})
export class TenantModule {}
