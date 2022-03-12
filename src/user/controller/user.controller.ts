import { NextFunction, Response, Request } from 'express';
import UserService from '../service/user.service';

class UserController {
  public getAllUsers = (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => UserService.getAllUsers(req, res, next);
}

export default new UserController();
