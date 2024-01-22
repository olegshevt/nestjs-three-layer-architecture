import { IsNumber } from 'class-validator';

export class CreateApiKeyDto {
  @IsNumber()
  readonly userId: number;
}
