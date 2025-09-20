import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateAppointmentDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  workScheduleIdentifier: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  physicianIdentifier: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  userIdentifier: number;
}
