import { NextFunction, Request, Response } from 'express';
import AuthService from './auth.service';

class AuthController {
  public signIn = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const user = await AuthService.signIn(req.body, req, res);

    res.status(200).json({ token: user });
    next();
  };

  public signUp = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    await AuthService.signUp(req.body);
    res.status(201).send();
    next();
  };
}

export default new AuthController();
