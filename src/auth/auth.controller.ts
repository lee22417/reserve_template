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
  HttpException,
  BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { VerifyAuthDto } from './dto/verify-auth.dto';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('인증 API')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @ApiOperation({ summary: '로그인 API' })
  async login(@Body() verifyAuthDto: VerifyAuthDto, @Res({ passthrough: true }) response) {
    const user = await this.authService.validateUser(verifyAuthDto);
    if (user) {
      return {
        statusCode: HttpStatus.OK,
        message: 'Success',
        token: await this.authService.getToken(user),
      };
    } else {
      throw new UnauthorizedException();
    }
  }

  @Post('/decode')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '토큰해석 API' })
  async decodeToken(@Req() req) {
    const token = req.app.locals.token;
    const payload = await this.authService.decodeToken(token);
    if (payload) {
      return { statusCode: HttpStatus.OK, message: 'Success', data: payload };
    } else {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Invalid signature',
      });
    }
  }
}
