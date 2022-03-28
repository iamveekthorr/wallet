import debug from 'debug';

import { NextFunction, Request, Response } from 'express';

import AppError from '../common/app-error.service';
import catchAsyncHandler from '../common/async-handler.service';
import AuthCredentialsDTO from '../auth-module/dto/auth-credentials.dto';

const log: debug.IDebugger = debug('app:middleware-validate-signin');

class ValidateSignInBody {
  public static validateSignIn = catchAsyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const { email, password }: AuthCredentialsDTO = req.body;
      if (password.trim() && email.trim()) {
        log(email, password, 'email and password');
        return next();
      }
      return next(new AppError('missing fields', 400));
    }
  );
}

export default ValidateSignInBody;
