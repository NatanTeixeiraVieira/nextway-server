import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSchema } from './database/typeorm/schemas/user.schema';

@Module({
	imports: [TypeOrmModule.forFeature([UserSchema])],
	controllers: [],
	providers: [],
})
export class UserModule {}
