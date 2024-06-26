import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { UserService } from '../user.service';
import { verify } from 'jsonwebtoken';
import { ExpressRequestInterface } from '@app/types/expressRequest.interface';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}
  async use(req: ExpressRequestInterface, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      req.user = null;
      next();
      return;
    }

    const token = req.headers.authorization.split(' ')[1];
    try {
      const decode = verify(token, process.env.JWT_SECRET);
      const user = await this.userService.getUserByid(decode.id);
      req.user = user;
      next();
      return;
    } catch (error) {
      console.log('error-' + error);
      req.user = null;
      next();
      return;
    }
    next();
  }
}
