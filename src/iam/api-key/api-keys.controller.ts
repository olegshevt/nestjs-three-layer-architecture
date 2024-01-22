import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ApiKeysService } from './api-keys.service';
import { CreateApiKeyDto } from './dto/create-api-key.dto';
import { Auth } from '../authentication/decorators/auth.decorator';
import { AuthType } from '../authentication/enums/auth-type.enum';

@Auth(AuthType.Bearer)
@Controller('api-key')
export class ApiKeyController {
  constructor(private readonly apiKeyService: ApiKeysService) {}

  //Use User's id just for demonstration purpose.
  @Post()
  async createByUserId(@Body() createApiKeyDto: CreateApiKeyDto) {
    return this.apiKeyService.createByUserId(createApiKeyDto);
  }

  @Get()
  findAll() {
    return this.apiKeyService.findAll();
  }

  @Get(':id')
  findOneByKey(@Param('id') id: string) {
    return this.apiKeyService.findOneByKey(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.apiKeyService.remove(+id);
  }
}
