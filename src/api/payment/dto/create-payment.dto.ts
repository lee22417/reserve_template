import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreatePaymentDto {
  @IsNumber()
  @ApiProperty({ description: '해당 결제건 결제 금액', example: '10000' })
  partial_price: number;

  @IsNumber()
  @ApiProperty({ description: '결제 유형', example: 'card' })
  method: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ description: '결제 카드사/은행명', example: 'bc' })
  bank: string;

  @IsNotEmpty()
  @ApiProperty({ description: '결제 성공 여부', example: 'true' })
  is_succeeded: boolean;
}
