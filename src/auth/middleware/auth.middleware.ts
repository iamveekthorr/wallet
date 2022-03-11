import debug from 'debug';
import { NextFunction, Request, Response } from 'express';
import AppError from '../../common/app-error.service';
import AuthCredentialsDTO from '../dto/auth-credentials.dto';

const log: debug.IDebugger = debug('app:auth-controller');
class AuthMiddleware {
  public async validateSignIn(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { email, password }: AuthCredentialsDTO = req.body;
    if (password && email) {
      log(email, password);
      next();
    } else {
      res.status(400).json({ message: 'missing fields', status: 'fail' });
      next(new AppError('missing fields', 400));
    }
  }

  public async validateSignUp(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { email, password, firstName, lastName }: AuthCredentialsDTO =
      req.body;

    if (password && email && firstName && lastName) {
      log(email, password, firstName, lastName);
      return next();
    }
    res.status(400).json({ message: 'missing fields', status: 'fail' });
    return next(new AppError('missing fields', 400));
  }
}

export default new AuthMiddleware();
