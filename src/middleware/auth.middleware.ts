import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('Middleware');
    let token = req.header('authorization');

    if (!token) {
      throw new HttpException('No token provided', HttpStatus.UNAUTHORIZED);
    }
    const bearerToken: string[] = token.split(' ');
    if (bearerToken.length == 2) {
      token = bearerToken[1];
    }
    req.app.locals.token = token;
    next();
  }
}
