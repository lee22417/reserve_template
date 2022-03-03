import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class VerifyAuthDto {
  @IsNotEmpty()
  @ApiProperty({ description: '회원 ID', example: 'test' })
  id: string;

  @IsNotEmpty()
  @ApiProperty({ description: '회원 비밀번호', example: '123123' })
  password: string;
}
