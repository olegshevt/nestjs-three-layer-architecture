import { Injectable, NotFoundException } from '@nestjs/common';
import { HashingService } from '../hashing/hashing.service';
import { randomUUID } from 'crypto';
import { User } from 'src/users/entities/user.entity';
import { ApiKey } from './entities/api-key.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateApiKeyDto } from './dto/create-api-key.dto';
import { GeneratedApiKeyPayload } from './interfaces/generated-api-key-payload.interface';

@Injectable()
export class ApiKeysService {
  constructor(
    private readonly hashingService: HashingService,
    @InjectRepository(ApiKey)
    private apiKeyRepository: Repository<ApiKey>,
  ) {}

  async createByUserId(
    createApiKeyDto: CreateApiKeyDto,
  ): Promise<GeneratedApiKeyPayload> {
    const apiKey = this.generateApiKey(createApiKeyDto.userId);
    //Its better to use more performant algorithm, because we need to process on each request.
    const hashedKey = await this.hashingService.hash(apiKey);
    const payload = { apiKey, hashedKey };

    const apiKeyEntity = new ApiKey();
    apiKeyEntity.key = hashedKey;
    apiKeyEntity.uuid = createApiKeyDto.userId.toString();
    apiKeyEntity.user = { id: createApiKeyDto.userId } as User;

    await this.apiKeyRepository.save(apiKeyEntity);

    return payload;
  }

  findAll() {
    return this.apiKeyRepository.find();
  }

  findOneByKey(id: string) {
    const apiKey = this.apiKeyRepository.findOne({
      where: { key: id },
    });

    if (!apiKey) {
      throw new NotFoundException(`Api Key ${id} not found`);
    }

    return apiKey;
  }

  async remove(id: number) {
    const apiKey = await this.apiKeyRepository.findOne({
      where: { id },
    });
    return this.apiKeyRepository.remove(apiKey);
  }

  async validate(apiKey: string, hashedKey: string): Promise<boolean> {
    return this.hashingService.compare(apiKey, hashedKey);
  }

  extractIdFromApiKey(apiKey: string): string {
    const [id] = Buffer.from(apiKey, 'base64').toString('ascii').split(' ');
    return id;
  }

  private generateApiKey(id: number): string {
    const apiKey = `${id} ${randomUUID()}`;
    return Buffer.from(apiKey).toString('base64');
  }
}
