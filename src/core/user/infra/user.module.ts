import { Providers } from '@/shared/application/constants/providers';
import { EnvConfig } from '@/shared/application/env-config/env-config';
import { AuthService } from '@/shared/application/services/auth.service';
import { HashService } from '@/shared/application/services/hash.service';
import { JwtService } from '@/shared/application/services/jwt.service';
import { LoggedUserService } from '@/shared/application/services/logged-user.service';
import { MailService } from '@/shared/application/services/mail.service';
import { UnitOfWork } from '@/shared/application/unit-of-work/unit-of-work';
import { AuthServiceModule } from '@/shared/infra/services/auth-service/auth-service.module';
import { HashServiceModule } from '@/shared/infra/services/hash-service/hash-service.module';
import { JwtServiceModule } from '@/shared/infra/services/jwt-service/jwt-service.module';
import { LoggedUserModule } from '@/shared/infra/services/logged-user/logged-user.module';
import { MailServiceModule } from '@/shared/infra/services/mail-service/mail-service.module';
import { Module } from '@nestjs/common';
import { getDataSourceToken, TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UserProviders } from '../application/constants/providers';
import { UserOutputMapper } from '../application/outputs/user-output';
import { UserQuery } from '../application/queries/user.query';
import { CheckEmailUseCase } from '../application/usecases/check-email.usecase';
import { LoginUseCase } from '../application/usecases/login.usecase';
import { LogoutUseCase } from '../application/usecases/logout.usecase';
import { ChangePasswordUseCase } from '../application/usecases/recover-password/change-password.usecase';
import { SendPasswordRecoveryEmailUseCase } from '../application/usecases/recover-password/send-password-recovery-email.usecase';
import { VerifyRecoverPasswordTokenUseCase } from '../application/usecases/recover-password/verify-recover-password-token.usecase';
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
			provide: UserProviders.USER_REPOSITORY_MAPPER,
			useClass: UserTypeormRepositoryMapper,
		},

		{ provide: UserProviders.USER_OUTPUT_MAPPER, useClass: UserOutputMapper },

		{
			provide: UserProviders.USER_REPOSITORY,
			useFactory: (
				dataSource: DataSource,
				mapper: UserTypeormRepositoryMapper,
			) => {
				return new UserTypeOrmRepository(
					dataSource.getRepository(UserSchema),
					mapper,
				);
			},
			inject: [getDataSourceToken(), UserProviders.USER_REPOSITORY_MAPPER],
		},

		{
			provide: UserProviders.USER_QUERY,
			useFactory: (dataSource: DataSource) => {
				return new UserTypeOrmQuery(dataSource.getRepository(UserSchema));
			},
			inject: [getDataSourceToken()],
		},

		{
			provide: RegisterUseCase,
			useFactory: (
				uow: UnitOfWork,
				repository: UserRepository,
				query: UserQuery,
				hashService: HashService,
				mailService: MailService,
				jwtService: JwtService,
				envConfig: EnvConfig,
				outputMapper: UserOutputMapper,
			) => {
				return new RegisterUseCase(
					uow,
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
				Providers.UNIT_OF_WORK,
				UserProviders.USER_REPOSITORY,
				UserProviders.USER_QUERY,
				Providers.HASH_SERVICE,
				Providers.MAIL_SERVICE,
				Providers.JWT_SERVICE,
				Providers.ENV_CONFIG_SERVICE,
				UserProviders.USER_OUTPUT_MAPPER,
			],
		},

		{
			provide: CheckEmailUseCase,
			useFactory: (
				uow: UnitOfWork,
				envConfigService: EnvConfig,
				jwtService: JwtService,
				userRepository: UserRepository,
				authService: AuthService,
			) => {
				return new CheckEmailUseCase(
					uow,
					envConfigService,
					jwtService,
					userRepository,
					authService,
				);
			},
			inject: [
				Providers.UNIT_OF_WORK,
				Providers.ENV_CONFIG_SERVICE,
				Providers.JWT_SERVICE,
				UserProviders.USER_REPOSITORY,
				Providers.AUTH_SERVICE,
			],
		},

		{
			provide: LoginUseCase,
			useFactory: (
				uow: UnitOfWork,
				userRepository: UserRepository,
				hashService: HashService,
				authService: AuthService,
			) => {
				return new LoginUseCase(uow, userRepository, hashService, authService);
			},
			inject: [
				Providers.UNIT_OF_WORK,
				UserProviders.USER_REPOSITORY,
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
				uow: UnitOfWork,
				userRepository: UserRepository,
				mailService: MailService,
				jwtService: JwtService,
				envConfigService: EnvConfig,
				userOutputMapper: UserOutputMapper,
			) => {
				return new SendPasswordRecoveryEmailUseCase(
					uow,
					userRepository,
					mailService,
					jwtService,
					envConfigService,
					userOutputMapper,
				);
			},
			inject: [
				Providers.UNIT_OF_WORK,
				UserProviders.USER_REPOSITORY,
				Providers.MAIL_SERVICE,
				Providers.JWT_SERVICE,
				Providers.ENV_CONFIG_SERVICE,
				UserProviders.USER_OUTPUT_MAPPER,
			],
		},

		{
			provide: VerifyRecoverPasswordTokenUseCase,
			useFactory: (jwtService: JwtService, envConfigService: EnvConfig) => {
				return new VerifyRecoverPasswordTokenUseCase(
					jwtService,
					envConfigService,
				);
			},
			inject: [Providers.JWT_SERVICE, Providers.ENV_CONFIG_SERVICE],
		},

		{
			provide: ChangePasswordUseCase,
			useFactory: (
				jwtService: JwtService,
				userRepository: UserRepository,
				hashService: HashService,
				loggedUserService: LoggedUserService,
			) => {
				return new ChangePasswordUseCase(
					jwtService,
					userRepository,
					hashService,
					loggedUserService,
				);
			},
			inject: [
				Providers.JWT_SERVICE,
				UserProviders.USER_REPOSITORY,
				Providers.HASH_SERVICE,
				Providers.LOGGED_USER_SERVICE,
			],
		},
	],
})
export class UserModule {}
