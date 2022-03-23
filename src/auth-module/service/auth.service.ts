import { NextFunction, Request, Response } from 'express';

import CookieOptionsDTO from '../dto/cookie-options.dto';
import AuthCredentialsDTO from '../dto/auth-credentials.dto';
import AppError from '../../common/app-error.service';
import JWTPayloadDTO from '../dto/jwt-payload.dto';
import UserResponseDTO from '../dto/login-response.dto';

import envConfig from '../../util/environment.config';
import jwtStrategy from '../jwt-strategy';
import userSchema from '../../user-module/user.schema';

class AuthService {
  public getCookieOptions(req: Request): CookieOptionsDTO {
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
    const cookieOptions: CookieOptionsDTO = this.getCookieOptions(req);

    // 3) Check if the user exists
    const user = await userSchema.getUserByEmail(email);

    // 4) Set payload for JWT
    const payload: JWTPayloadDTO = { email, role: user.role, id: user.id };

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
}

export default new AuthService();
