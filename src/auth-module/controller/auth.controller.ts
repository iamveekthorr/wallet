import { NextFunction, Request, Response } from 'express';
import AuthService from '../service/auth.service';
import catchAsyncHandler from '../../common/async-handler.service';

class AuthController {
  public signIn = catchAsyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      AuthService.signIn(req.body, req, res, next);
    }
  );

  public signUp = catchAsyncHandler(async (req: Request): Promise<void> => {
    await AuthService.signUp(req.body);
  });

  public signOut = (req: Request, res: Response): void =>
    AuthService.signOut(req, res);
}

export default new AuthController();
