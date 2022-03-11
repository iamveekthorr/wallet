import { Request, Response } from 'express';
import CookieOptions from './cookie-options.interface';
import AuthCredentialsDTO from './dto/auth-credentials.dto';
import JWTStrategy from './jwt-strategy';
import UserModel from '../user/user.schema';
import AppError from '../common/app-error.service';
import JWTPayload from './jwt-payload.interface';

class AuthService {
  public signIn = async (
    authCredentialsDTO: AuthCredentialsDTO,
    req: Request,
    res: Response
  ): Promise<string> => {
    const { email, password } = authCredentialsDTO;

    const cookieOptions: CookieOptions = {
      secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
      expiresIn: new Date(
        Date.now() +
          Number(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    };

    const user = await UserModel.getUserByEmail(email);

    const payload: JWTPayload = { email, role: user.role };
    const token = JWTStrategy.createJWT(payload);

    if (!(await UserModel.validatePassword(password, user.password))) {
      throw new AppError('Invalid login credentials', 400);
    }

    res.cookie('jwt', token, cookieOptions);
    return token;
  };

  public signUp = async (
    authCredentialsDTO: AuthCredentialsDTO
  ): Promise<void> => UserModel.createUser(authCredentialsDTO);
}

export default new AuthService();
