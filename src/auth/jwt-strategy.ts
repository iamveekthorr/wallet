import jwt from 'jsonwebtoken';
import AuthCredentialsDTO from './dto/auth-credentials.dto';
import JWTPayload from './jwt-payload.interface';

class JWTStrategy {
  private signToken = (payload: JWTPayload): string =>
    jwt.sign({ payload }, process.env.JWT_SECRET_KEY!, {
      expiresIn: process.env.JWT_EXPIRES_IN!,
    });

  public createJWT = (user: AuthCredentialsDTO): string => this.signToken(user);
}

export default new JWTStrategy();
