import jwt from 'jsonwebtoken';
import envConfig from '../util/environment.config';
import JWTPayloadDTO from './dto/jwt-payload.dto';

class JWTStrategy {
  public createJWT = (payload: JWTPayloadDTO): string => {
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
