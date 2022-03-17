import { NextFunction, Request, Response } from 'express';
import debug from 'debug';
import jwt from 'jsonwebtoken';

import envConfig from '../../util/environment.config';

import AuthCredentialsDTO from '../dto/auth-credentials.dto';
import userSchema from '../../user-module/user.schema';

import AppError from '../../common/app-error.service';
import authService from '../service/auth.service';
import catchAsyncHandler from '../../common/async-handler.service';

import jwtStrategy from '../jwt-strategy';
import { JTWDecoded } from '../../util/jwt.decoded';

import JWTPayload from '../interfaces/jwt-payload.interface';
import CookieOptions from '../interfaces/cookie-options.interface';

const log: debug.IDebugger = debug('app:auth-controller');
class AuthMiddleware {
  private decodeJWT = (token: string): JTWDecoded =>
    jwt.verify(token, envConfig.JWT_SECRET_KEY!) as JTWDecoded;

  public validateSignIn = catchAsyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const { email, password }: AuthCredentialsDTO = req.body;
      if (password.trim() && email.trim()) {
        log(email, password, 'email and password');
        return next();
      }
      return next(new AppError('missing fields', 400));
    }
  );

  public validateSignUp = catchAsyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const { email, password, firstName, lastName }: AuthCredentialsDTO =
        req.body;

      if (
        password.trim() &&
        email.trim() &&
        firstName.trim() &&
        lastName.trim()
      ) {
        log(email, password, firstName, lastName);
        return next();
      }
      return next(new AppError('missing fields', 400));
    }
  );

  public protectRoutes = catchAsyncHandler(
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
      const { sub } = this.decodeJWT(token);

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

  public checkJWTExpired = catchAsyncHandler(
    async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
      const authToken =
        req.cookies.jwt || req.headers.authorization?.split(' ')[0];

      if (authToken) {
        const { exp, sub } = this.decodeJWT(authToken);

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

        const payload: JWTPayload = {
          email: currentUser.email,
          role: currentUser.role,
          id: currentUser.id,
        };

        const token = jwtStrategy.createJWT(payload);

        const cookieOptions: CookieOptions = authService.getCookieOptions(req);

        res.cookie('jwt', token, cookieOptions);
      }
    }
  );
}

export default new AuthMiddleware();
