import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ description: 'The name of a product.' })
  @IsString()
  readonly name: string;

  @ApiProperty({ description: 'The brand name of a product.' })
  @IsString()
  readonly brand: string;

  @ApiProperty({ example: [] })
  @IsString({ each: true })
  readonly characteristics: string[];
}
