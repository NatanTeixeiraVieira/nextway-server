import { Providers } from '@/shared/application/constants/providers';
import { EnvConfig } from '@/shared/application/env-config/env-config';
import { AuthService } from '@/shared/application/services/auth.service';
import { HashService } from '@/shared/application/services/hash.service';
import { JwtService } from '@/shared/application/services/jwt.service';
import { LoggedUserService } from '@/shared/application/services/logged-user.service';
import { MailService } from '@/shared/application/services/mail.service';
import { AuthServiceModule } from '@/shared/infra/services/auth-service/auth-service.module';
import { HashServiceModule } from '@/shared/infra/services/hash-service/hash-service.module';
import { JwtServiceModule } from '@/shared/infra/services/jwt-service/jwt-service.module';
import { LoggedUserModule } from '@/shared/infra/services/logged-user/logged-user.module';
import { MailServiceModule } from '@/shared/infra/services/mail-service/mail-service.module';
import { Module } from '@nestjs/common';
import { getDataSourceToken, TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UserOutputMapper } from '../application/outputs/user-output';
import { UserQuery } from '../application/queries/user.query';
import { CheckEmailUseCase } from '../application/usecases/check-email.usecase';
import { LoginUseCase } from '../application/usecases/login.usecase';
import { LogoutUseCase } from '../application/usecases/logout.usecase';
import { SendPasswordRecoveryEmailUseCase } from '../application/usecases/recover-password/send-password-recovery-email.usecase';
import { RefreshTokenUseCase } from '../application/usecases/refresh-token.usecase';
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
		AuthServiceModule,
		LoggedUserModule,
	],
	controllers: [UserController],
	providers: [
		{
			provide: Providers.USER_REPOSITORY_MAPPER,
			useClass: UserTypeormRepositoryMapper,
		},

		{ provide: Providers.USER_OUTPUT_MAPPER, useClass: UserOutputMapper },

		{
			provide: Providers.USER_REPOSITORY,
			useFactory: (
				dataSource: DataSource,
				mapper: UserTypeormRepositoryMapper,
			) => {
				return new UserTypeOrmRepository(
					dataSource.getRepository(UserSchema),
					mapper,
				);
			},
			inject: [getDataSourceToken(), Providers.USER_REPOSITORY_MAPPER],
		},

		{
			provide: Providers.USER_QUERY,
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
				Providers.USER_REPOSITORY,
				Providers.USER_QUERY,
				Providers.HASH_SERVICE,
				Providers.MAIL_SERVICE,
				Providers.JWT_SERVICE,
				Providers.ENV_CONFIG_SERVICE,
				Providers.USER_OUTPUT_MAPPER,
			],
		},

		{
			provide: CheckEmailUseCase,
			useFactory: (
				envConfigService: EnvConfig,
				jwtService: JwtService,
				userRepository: UserRepository,
				authService: AuthService,
			) => {
				return new CheckEmailUseCase(
					envConfigService,
					jwtService,
					userRepository,
					authService,
				);
			},
			inject: [
				Providers.ENV_CONFIG_SERVICE,
				Providers.JWT_SERVICE,
				Providers.USER_REPOSITORY,
				Providers.AUTH_SERVICE,
			],
		},

		{
			provide: LoginUseCase,
			useFactory: (
				userRepository: UserRepository,
				hashService: HashService,
				authService: AuthService,
			) => {
				return new LoginUseCase(userRepository, hashService, authService);
			},
			inject: [
				Providers.USER_REPOSITORY,
				Providers.HASH_SERVICE,
				Providers.AUTH_SERVICE,
			],
		},

		{
			provide: LogoutUseCase,
			useFactory: (authService: AuthService) => {
				return new LogoutUseCase(authService);
			},
			inject: [Providers.AUTH_SERVICE],
		},

		{
			provide: RefreshTokenUseCase,
			useFactory: (
				authService: AuthService,
				loggedUserService: LoggedUserService,
			) => {
				return new RefreshTokenUseCase(authService, loggedUserService);
			},
			inject: [Providers.AUTH_SERVICE, Providers.LOGGED_USER_SERVICE],
		},

		{
			provide: SendPasswordRecoveryEmailUseCase,
			useFactory: (
				userRepository: UserRepository,
				mailService: MailService,
				jwtService: JwtService,
				envConfigService: EnvConfig,
				userOutputMapper: UserOutputMapper,
			) => {
				return new SendPasswordRecoveryEmailUseCase(
					userRepository,
					mailService,
					jwtService,
					envConfigService,
					userOutputMapper,
				);
			},
			inject: [
				Providers.USER_REPOSITORY,
				Providers.MAIL_SERVICE,
				Providers.JWT_SERVICE,
				Providers.ENV_CONFIG_SERVICE,
				Providers.USER_OUTPUT_MAPPER,
			],
		},
	],
})
export class UserModule {}
