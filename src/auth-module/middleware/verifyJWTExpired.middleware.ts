import { Request, Response } from 'express';

import catchAsyncHandler from '../../common/async-handler.service';
import userSchema from '../../user-module/user.schema';
import CookieOptionsDTO from '../dto/cookie-options.dto';
import JWTPayloadDTO from '../dto/jwt-payload.dto';
import jwtStrategy from '../jwt-strategy';
import authService from '../service/auth.service';
import DecodeJWTMiddleware from './decodeJWT.middleware';

class VerifyJWTExpired {
  public static checkJWTExpired = catchAsyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const authToken =
        req.cookies.jwt || req.headers.authorization?.split(' ')[0];

      if (authToken) {
        const { exp, sub } = DecodeJWTMiddleware.decodeJWT(authToken);

        if (exp && exp * 1000 < Date.now()) {
          res.status(200).json({
            message: 'success',
            data: { user: null },
          });
          return;
        }

        const currentUser = await userSchema.getUserById(sub);

        if (!currentUser) {
          res.status(200).json({
            message: 'success',
            data: { user: null },
          });
          return;
        }
        req.currentUser = currentUser;

        const payload: JWTPayloadDTO = {
          email: currentUser.email,
          role: currentUser.role,
          id: currentUser.id,
        };

        const token = jwtStrategy.createJWT(payload);

        const cookieOptions: CookieOptionsDTO =
          authService.getCookieOptions(req);

        res.cookie('jwt', token, cookieOptions);
      }
    }
  );
}

export default VerifyJWTExpired;
