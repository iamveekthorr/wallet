import { Request, Response } from 'express';

import catchAsyncHandler from '../common/async-handler.service';
import userSchema from '../user-module/user.schema';
import CookieOptionsDTO from '../auth-module/dto/cookie-options.dto';
import JWTPayloadDTO from '../auth-module/dto/jwt-payload.dto';
import jwtStrategy from '../auth-module/jwt-strategy';
import authService from '../auth-module/service/auth.service';
import DecodeJWTMiddleware from './decodeJWT.middleware';

class VerifyJWTExpired {
  public static checkJWTExpired = catchAsyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      // Get auth token from the header
      const authToken =
        req.cookies.jwt || req.headers.authorization?.split(' ')[0];

      // Check if token exists
      if (authToken) {
        // destructure expiration date and subject from token.
        const { exp, sub } = DecodeJWTMiddleware.decodeJWT(authToken);

        // Check if expiration date exists,
        // and expiration date is less than current date
        if (exp && exp * 1000 < Date.now()) {
          res.status(200).json({
            message: 'success',
            data: { user: null },
          });
          return;
        }

        // Check if the user exists in the DATABASE
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
