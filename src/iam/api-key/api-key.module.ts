import { Module } from '@nestjs/common';
import { ApiKeysService } from './api-keys.service';
import { ApiKeyController } from './api-keys.controller';
import { HashingService } from '../hashing/hashing.service';
import { BcryptService } from '../hashing/bcrypt.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiKey } from 'src/iam/api-key/entities/api-key.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ApiKey])],
  controllers: [ApiKeyController],
  providers: [
    ApiKeysService,
    { provide: HashingService, useClass: BcryptService },
  ],
})
export class ApiKeyModule {}
