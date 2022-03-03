import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

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
}
