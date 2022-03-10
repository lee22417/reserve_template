import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateReservationDto {
  @IsNotEmpty()
  @ApiProperty({ description: '예약 일자 및 시간', example: '2020-02-02' })
  reserved_at;

  @IsNumber()
  @ApiProperty({ description: '예약 인원 수', example: '1' })
  num_of_people: number;

  @IsNumber()
  @ApiProperty({ description: '예약 가격', example: '10000' })
  price: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: '예약자', example: 'test' })
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: '예약자 전화번호', example: '010-1234-1234' })
  phone_number: string;
}
