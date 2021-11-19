import { IsEmail, IsNotEmpty } from 'class-validator';

export class VerifyAuthDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  password: string;
}
