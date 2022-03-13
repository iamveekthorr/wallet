import UserDTO from '../../user-module/dto/user.dto';

declare global {
  namespace Express {
    export interface Request {
      currentUser?: UserDTO;
    }
  }
}
