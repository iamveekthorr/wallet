import { Request, Response } from 'express';
import CookieOptions from '../interfaces/cookie-options.interface';
import AuthCredentialsDTO from '../dto/auth-credentials.dto';
import JWTStrategy from '../jwt-strategy';
import UserModel from '../../user-module/user.schema';
import AppError from '../../common/app-error.service';
import JWTPayload from '../interfaces/jwt-payload.interface';

import envConfig from '../../util/environment.config';

class AuthService {
  private getCookieOptions(req: Request): CookieOptions {
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
  // @Param NextFunction
  public signIn = async (
    authCredentialsDTO: AuthCredentialsDTO,
    req: Request,
    res: Response
  ): Promise<string> => {
    // 1) Get the email and password form authCredentialsDTO
    const { email, password } = authCredentialsDTO;

    // 2) Create cookie options
    const cookieOptions: CookieOptions = this.getCookieOptions(req);

    // 3) Check if the user exists
    const user = await UserModel.getUserByEmail(email);

    // 4) Set payload for JWT
    const payload: JWTPayload = { email, role: user.role, id: user.id };

    // 5) Check if password is correct
    if (!(await UserModel.validatePassword(password, user.password))) {
      throw new AppError('Invalid login credentials', 400);
    }

    // 6) Create JWT
    const token = JWTStrategy.createJWT(payload);

    // 7) Set cookie name, value and cookie options
    res.cookie('jwt', token, cookieOptions);

    // 8) return token to Controller
    return token;
  };

  // Sign up service
  // @param AuthCredentialsDTO
  public signUp = async (
    authCredentialsDTO: AuthCredentialsDTO
  ): Promise<void> => UserModel.createUser(authCredentialsDTO);

  // Logout
  public signOut = (req: Request, res: Response): void => {
    const cookieOptions = this.getCookieOptions(req);

    cookieOptions.expiresIn = new Date(Date.now() + 1 * 1000);

    res.cookie('jwt', 'loggedOut', cookieOptions);

    res.status(200).send();
  };
}

export default new AuthService();
