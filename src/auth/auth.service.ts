import { Request, Response } from 'express';
import CookieOptions from './cookie-options.interface';
import AuthCredentialsDTO from './dto/auth-credentials.dto';
import JWTStrategy from './jwt-strategy';
import UserModel from './user.model';

class AuthService {
  public signIn = async (
    authCredentialsDTO: AuthCredentialsDTO,
    req: Request,
    res: Response
  ): Promise<string> => {
    const token = JWTStrategy.createJWT(authCredentialsDTO);

    const cookieOptions: CookieOptions = {
      secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
      expiresIn: new Date(
        Date.now() +
          Number(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    };
    res.cookie('jwt', token, cookieOptions);
    return token;
  };

  public signUp = async (
    authCredentialsDTO: AuthCredentialsDTO
  ): Promise<void> => UserModel.createUser(authCredentialsDTO);
}

export default new AuthService();
