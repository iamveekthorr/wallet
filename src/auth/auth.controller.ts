import { NextFunction, Request, Response } from 'express';
import AuthService from './auth.service';
import catchAsyncHandler from '../common/async-handler.service';

class AuthController {
  public signIn = catchAsyncHandler(
    async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
      const user = await AuthService.signIn(req.body, req, res);
      res.status(200).json({ token: user });
    }
  );

  public signUp = catchAsyncHandler(
    async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
      await AuthService.signUp(req.body);
      res.status(201).send();
    }
  );
}

export default new AuthController();
