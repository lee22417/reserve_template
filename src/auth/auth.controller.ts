import {
  Controller,
  Post,
  Request,
  UseGuards,
  Body,
  Res,
  Get,
  Req,
  HttpStatus,
} from '@nestjs/common';
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
        statusCode: HttpStatus.OK,
        msg: 'Success',
        token: await this.authService.getToken(user),
      };
    } else {
      return { statusCode: HttpStatus.UNAUTHORIZED, msg: 'Unauthorized' };
    }
  }

  @Post('/decode')
  async decodeToken(@Req() req) {
    const token = req.app.locals.token;
    const payload = await this.authService.decodeToken(token);
    if (payload) {
      return { statusCode: HttpStatus.OK, msg: 'Success', data: payload };
    } else {
      return { statusCode: HttpStatus.BAD_REQUEST, msg: 'Invalid signature' };
    }
  }
}
