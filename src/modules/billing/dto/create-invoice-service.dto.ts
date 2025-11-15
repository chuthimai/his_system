import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateInvoiceServiceDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  invoiceIdentifier: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  serviceIdentifier: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  price: number;
}
