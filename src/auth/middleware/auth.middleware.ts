import { NextFunction, Request, Response } from 'express';
import debug from 'debug';
import jwt from 'jsonwebtoken';
import AppError from '../../common/app-error.service';
import catchAsyncHandler from '../../common/async-handler.service';
import AuthCredentialsDTO from '../dto/auth-credentials.dto';
import envConfig from '../../util/environment.config';
import userSchema from '../../user/user.schema';
import { JTWDecoded } from '../../util/jwt.decoded';

const log: debug.IDebugger = debug('app:auth-controller');
class AuthMiddleware {
  public validateSignIn = catchAsyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const { email, password }: AuthCredentialsDTO = req.body;
      if (password && email) {
        log(email, password);
        next();
      } else {
        res.status(400).json({ message: 'missing fields', status: 'fail' });
        next(new AppError('missing fields', 400));
      }
    }
  );

  public validateSignUp = catchAsyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const { email, password, firstName, lastName }: AuthCredentialsDTO =
        req.body;

      if (password && email && firstName && lastName) {
        log(email, password, firstName, lastName);
        return next();
      }
      res.status(400).json({ message: 'missing fields', status: 'fail' });
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
      const { sub } = jwt.verify(
        token,
        envConfig.JWT_SECRET_KEY!
      ) as JTWDecoded;

      const user = await userSchema.getUserById(sub);

      if (!user) {
        return next(
          new AppError(
            'This user does not exist anymore. Please log in again.',
            401
          )
        );
      }

      // create namespace for currentUser property in express.d.ts
      req.currentUser = user;
      return next();
    }
  );
}

export default new AuthMiddleware();
