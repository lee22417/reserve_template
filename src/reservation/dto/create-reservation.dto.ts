import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateReservationDto {
  @IsNotEmpty()
  reserved_at;

  @IsNumber()
  num_of_people: number;

  @IsNumber()
  price: number;
}
