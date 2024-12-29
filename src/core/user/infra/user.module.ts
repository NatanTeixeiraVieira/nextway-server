import { EnvConfig } from '@/shared/application/env-config/env-config';
import { HashService } from '@/shared/application/services/hash.service';
import { JwtService } from '@/shared/application/services/jwt.service';
import { MailService } from '@/shared/application/services/mail.service';
import { EnvConfigService } from '@/shared/infra/env-config/env-config.service';
import { HashBcryptService } from '@/shared/infra/services/hash-service/bcrypt/hash-bcrypt.service';
import { HashServiceModule } from '@/shared/infra/services/hash-service/hash-service.module';
import { JwtServiceModule } from '@/shared/infra/services/jwt-service/jwt-service.module';
import { JwtNestjsService } from '@/shared/infra/services/jwt-service/nestjs/jwt-nestjs.service';
import { MailServiceModule } from '@/shared/infra/services/mail-service/mail-service.module';
import { MailNestjsService } from '@/shared/infra/services/mail-service/nestjs/mail-nestjs.service';
import { Module } from '@nestjs/common';
import { getDataSourceToken, TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UserOutputMapper } from '../application/outputs/user-output';
import { UserQuery } from '../application/queries/user.query';
import { RegisterUseCase } from '../application/usecases/register.usecase';
import { UserRepository } from '../domain/repositories/user.repository';
import { UserController } from './controllers/user.controller';
import { UserTypeOrmQuery } from './database/typeorm/queries/user-typeorm.query';
import { UserTypeormRepositoryMapper } from './database/typeorm/repositories/user-typeorm-repository-mapper';
import { UserTypeOrmRepository } from './database/typeorm/repositories/user-typeorm.repository';
import { UserSchema } from './database/typeorm/schemas/user.schema';

@Module({
	imports: [
		TypeOrmModule.forFeature([UserSchema]),
		HashServiceModule,
		MailServiceModule,
		JwtServiceModule,
	],
	controllers: [UserController],
	providers: [
		UserTypeormRepositoryMapper,
		UserOutputMapper,

		{
			provide: UserTypeOrmRepository,
			useFactory: (
				dataSource: DataSource,
				mapper: UserTypeormRepositoryMapper,
			) => {
				return new UserTypeOrmRepository(
					dataSource.getRepository(UserSchema),
					mapper,
				);
			},
			inject: [getDataSourceToken(), UserTypeormRepositoryMapper],
		},

		{
			provide: UserTypeOrmQuery,
			useFactory: (dataSource: DataSource) => {
				return new UserTypeOrmQuery(dataSource.getRepository(UserSchema));
			},
			inject: [getDataSourceToken()],
		},

		{
			provide: RegisterUseCase,
			useFactory: (
				repository: UserRepository,
				query: UserQuery,
				hashService: HashService,
				mailService: MailService,
				jwtService: JwtService,
				envConfig: EnvConfig,
				outputMapper: UserOutputMapper,
			) => {
				return new RegisterUseCase(
					repository,
					query,
					hashService,
					mailService,
					jwtService,
					envConfig,
					outputMapper,
				);
			},
			inject: [
				UserTypeOrmRepository,
				UserTypeOrmQuery,
				HashBcryptService,
				MailNestjsService,
				JwtNestjsService,
				EnvConfigService,
				UserOutputMapper,
			],
		},
	],
})
export class UserModule {}
