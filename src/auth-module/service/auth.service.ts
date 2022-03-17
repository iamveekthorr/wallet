import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import debug from 'debug';

import CookieOptions from '../interfaces/cookie-options.interface';
import AuthCredentialsDTO from '../dto/auth-credentials.dto';
import AppError from '../../common/app-error.service';
import JWTPayload from '../interfaces/jwt-payload.interface';
import UserResponseDTO from '../interfaces/login-response.interface';

import envConfig from '../../util/environment.config';
import jwtStrategy from '../jwt-strategy';
import userSchema from '../../user-module/user.schema';
import catchAsyncHandler from '../../common/async-handler.service';
import { JTWDecoded } from '../../util/jwt.decoded';

const log: debug.IDebugger = debug('app:auth-service');
class AuthService {
  public getCookieOptions(req: Request): CookieOptions {
    return {
      secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
      expiresIn: new Date(
        Date.now() + envConfig.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    };
  }

  // @Param req: Request,
  // @Param res: Response,
  public signIn = async (
    authCredentialsDTO: AuthCredentialsDTO,
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    // 1) Get the email and password form authCredentialsDTO
    const { email, password } = authCredentialsDTO;

    // 2) Create cookie options
    const cookieOptions: CookieOptions = this.getCookieOptions(req);

    // 3) Check if the user exists
    const user = await userSchema.getUserByEmail(email);

    // 4) Set payload for JWT
    const payload: JWTPayload = { email, role: user.role, id: user.id };

    // 5) Check if password is correct
    if (!(await userSchema.validatePassword(password, user.password))) {
      return next(new AppError('Invalid login credentials', 401));
    }

    // 6) Create JWT
    const token = jwtStrategy.createJWT(payload);

    // 7) Set cookie name, value and cookie options
    res.cookie('jwt', token, cookieOptions);

    const userObject: UserResponseDTO = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    };

    // 8) send response to client
    res
      .status(200)
      .json({ message: 'success', data: { user: userObject, token } });
  };

  // Sign up service
  // @param AuthCredentialsDTO
  public signUp = async (
    authCredentialsDTO: AuthCredentialsDTO
  ): Promise<void> => userSchema.createUser(authCredentialsDTO);

  // Logout
  public signOut = (req: Request, res: Response): void => {
    const cookieOptions = this.getCookieOptions(req);

    cookieOptions.expiresIn = new Date(Date.now() + 1 * 1000);

    res.cookie('jwt', 'loggedOut', cookieOptions);

    res.status(200).send();
  };

  private decodeJWT = (token: string): JTWDecoded =>
    jwt.verify(token, envConfig.JWT_SECRET_KEY!) as JTWDecoded;

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

        const cookieOptions: CookieOptions = this.getCookieOptions(req);

        res.cookie('jwt', token, cookieOptions);
      }
    }
  );
}

export default new AuthService();
