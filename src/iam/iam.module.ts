import { Module } from '@nestjs/common';
import { HashingService } from './hashing/hashing.service';
import { BcryptService } from './hashing/bcrypt.service';
import { AuthenticationController } from './authentication/authentication.controller';
import { AuthenticationService } from './authentication/authentication.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from './config/jwt.config';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from './authentication/guards/access-token/access-token.guard';
import { AuthenticationGuard } from './authentication/guards/authentication/authentication.guard';
import { RefreshTokenIdsStorage } from './authentication/refresh-token-ids.storage';
// import { RolesGuard } from './authorization/guards/roles.guard';
// import { PermissionsGuard } from './authorization/guards/permissions.guard';
import { PolicyHandlerStorage } from './authorization/policies/policy-handlers.storage';
import { FrameworkContributorPolicyHandler } from './authorization/policies/framework-contributor.policy';
import { PoliciesGuard } from './authorization/guards/policies.guard';
import { ApiKeysService } from './api-key/api-keys.service';
import { ApiKey } from 'src/iam/api-key/entities/api-key.entity';
import { ApiKeyGuard } from './api-key/guards/api-key/api-key.guard';
import { ApiKeyModule } from './api-key/api-key.module';
import { GoogleAuthenticationService } from './authentication/social/google-authentication.service';
import { GoogleAuthenticationController } from './authentication/social/google-authentication.controller';
import { OtpAuthenticationService } from './authentication/otp-authentication.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, ApiKey]),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    ApiKeyModule,
  ],
  providers: [
    { provide: HashingService, useClass: BcryptService },
    { provide: APP_GUARD, useClass: AuthenticationGuard },
    // { provide: APP_GUARD, useClass: RolesGuard },
    // { provide: APP_GUARD, useClass: PermissionsGuard },
    { provide: APP_GUARD, useClass: PoliciesGuard },
    AuthenticationService,
    RefreshTokenIdsStorage,
    AccessTokenGuard,
    PolicyHandlerStorage,
    FrameworkContributorPolicyHandler,
    ApiKeysService,
    ApiKeyGuard,
    GoogleAuthenticationService,
    OtpAuthenticationService,
  ],
  controllers: [AuthenticationController, GoogleAuthenticationController],
})
export class IamModule {}
