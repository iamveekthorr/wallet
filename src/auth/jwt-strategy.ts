import jwt from 'jsonwebtoken';
import JWTPayload from './jwt-payload.interface';

class JWTStrategy {
  public createJWT = (payload: JWTPayload): string =>
    jwt.sign({ payload }, process.env.JWT_SECRET_KEY!, {
      expiresIn: process.env.JWT_EXPIRES_IN!,
    });
}

export default new JWTStrategy();
