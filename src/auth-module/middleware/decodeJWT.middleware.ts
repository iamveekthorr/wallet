import jwt from 'jsonwebtoken';

import envConfig from '../../util/environment.config';

import { JTWDecoded } from '../../util/jwt.decoded';

class DecodeJWTMiddleware {
  public static decodeJWT = (token: string): JTWDecoded =>
    jwt.verify(token, envConfig.JWT_SECRET_KEY!) as JTWDecoded;
}

export default DecodeJWTMiddleware;
