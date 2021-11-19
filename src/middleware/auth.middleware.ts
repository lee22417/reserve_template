import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('Middleware');
    const token = req.header('authorization');

    if (token) {
      // const payload = [];
      // console.log(payload);
      // res.locals.payload = payload;
    }
    next();
  }
}
