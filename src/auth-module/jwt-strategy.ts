import jwt from 'jsonwebtoken';
import envConfig from '../util/environment.config';
import JWTPayload from './interfaces/jwt-payload.interface';

class JWTStrategy {
  public createJWT = (payload: JWTPayload): string => {
    const { id, email, role } = payload;
    return jwt.sign(
      { sub: id, email: email, role: role },
      envConfig.JWT_SECRET_KEY!,
      {
        expiresIn: envConfig.JWT_EXPIRES_IN!,
      }
    );
  };
}

export default new JWTStrategy();
