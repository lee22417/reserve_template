import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    let token = req.header('authorization');

    if (!token) {
      throw new HttpException('No token provided', HttpStatus.UNAUTHORIZED);
    }
    const bearerToken: string[] = token.split(' ');
    if (bearerToken.length == 2) {
      token = bearerToken[1];
    }

    const payload = await this.authService.decodeToken(token);
    req.app.locals.payload = payload;
    console.log(req.app.locals);
    next();
  }
}
