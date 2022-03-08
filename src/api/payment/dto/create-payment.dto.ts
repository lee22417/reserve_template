import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { PaymentMethod } from 'src/entities/payment.entity';

export class CreatePaymentDto {
  @IsNumber()
  @ApiProperty({ description: '해당 결제건 결제 금액', example: '10000' })
  price: number;

  @IsNotEmpty()
  @ApiProperty({ description: '결제 유형', example: 'CART / BANK' })
  method: PaymentMethod;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ description: '결제 카드사/은행명', example: 'bc' })
  bank: string;

  @IsNotEmpty()
  @ApiProperty({ description: '결제 성공 여부', example: 'true' })
  is_succeeded: boolean;
}
