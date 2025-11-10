import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateSpecimenDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  type: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  condition: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  state: string;
}
