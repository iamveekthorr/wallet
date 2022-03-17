import { NextFunction, Request, Response } from 'express';
import catchAsyncHandler from '../../common/async-handler.service';
import userSchema from '../user.schema';

class UserService {
  public getAllUsers = catchAsyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const users = await userSchema.getAllUsers();
      res.status(200).json({
        users,
      });
      next();
    }
  );
}

export default new UserService();
