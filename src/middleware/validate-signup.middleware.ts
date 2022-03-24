import { NextFunction, Request, Response } from 'express';

import AppError from '../common/app-error.service';
import catchAsyncHandler from '../common/async-handler.service';
import AuthCredentialsDTO from '../auth-module/dto/auth-credentials.dto';

class ValidateSignUpBody {
  public static validateSignUp = catchAsyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const { email, password, firstName, lastName }: AuthCredentialsDTO =
        req.body;

      if (
        password.trim() &&
        email.trim() &&
        firstName.trim() &&
        lastName.trim()
      ) {
        return next();
      }
      return next(new AppError('missing fields', 400));
    }
  );
}

export default ValidateSignUpBody;
