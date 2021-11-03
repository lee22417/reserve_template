import { IsDate, IsNumber, IsString } from 'class-validator';

export class CreateReservationDto {
  @IsDate()
  reserved_at: Date;

  @IsNumber()
  num_of_people: number;

  @IsNumber()
  price: number;
}
