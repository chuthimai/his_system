import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class DeleteAppointmentDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  reason: string;
}
