import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateAppointmentDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  workScheduleIdentifier: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  physicianIdentifier?: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  userIdentifier: number;
}
