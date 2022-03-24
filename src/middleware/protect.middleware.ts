import { NextFunction, Request, Response } from 'express';

import AppError from '../common/app-error.service';
import catchAsyncHandler from '../common/async-handler.service';
import userSchema from '../user-module/user.schema';
import DecodeJWTMiddleware from './decodeJWT.middleware';

class ProtectRoutes {
  public static protectRoutes = catchAsyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      // Get JWT Token and check if it exists
      const token: string | undefined =
        req.cookies.jwt || req.headers.authorization?.split(' ')[1];

      if (!token) {
        return next(
          new AppError(
            'You are not logged in. Please log in to gain access.',
            401
          )
        );
      }

      // Verify token
      const { sub } = DecodeJWTMiddleware.decodeJWT(token);

      const user = await userSchema.getUserById(sub);

      if (!user) {
        return next(
          new AppError('This user does not exist. Please log in again.', 401)
        );
      }

      // create namespace for currentUser property in express.d.ts
      req.currentUser = user;
      return next();
    }
  );
}

export default ProtectRoutes;
