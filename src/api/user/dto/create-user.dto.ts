import { IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  password: string;

  @IsString()
  phone_number: string;

  @IsString()
  email: string;
}
