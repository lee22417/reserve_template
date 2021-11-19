import { Controller, Post, Request, UseGuards, Body, Res, Get, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { VerifyAuthDto } from './dto/verify-auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(@Body() verifyAuthDto: VerifyAuthDto, @Res({ passthrough: true }) response) {
    const user = await this.authService.validateUser(verifyAuthDto);
    if (user) {
      return {
        statusCode: 200,
        msg: 'Success',
        token: await this.authService.login(verifyAuthDto),
      };
    } else {
      return { statusCode: 400, msg: 'Unauthorized' };
    }
  }
}
