import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';

@Injectable()
export class authMiddleware implements NestMiddleware {
  use(req: Request, _: Response, next: NextFunction) {
    const exceptions = ['password'];

    Object.keys(req.body).forEach((key) => {
      if (!exceptions.includes(key) && typeof req.body[key] === 'string') {
        req.body[key] = req.body[key].replace(/\s+/g, '');
      }
    });

    next();
  }
}
