import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @ApiProperty({ description: '회원 ID', example: 'test' })
  id: string;

  @IsString()
  @ApiProperty({ description: '회원 이름', example: 'name' })
  name: string;

  @IsString()
  @ApiProperty({ description: '회원 비밀번호', example: '123123' })
  password: string;

  @IsString()
  @ApiProperty({ description: '전화 번호', example: '010-1234-1234' })
  phone_number: string;

  @IsEmail()
  @ApiProperty({ description: '이메일', example: 'test@email.com' })
  email: string;
}
