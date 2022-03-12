import UserDTO from '../../user/dto/user.dto';

declare global {
  namespace Express {
    export interface Request {
      currentUser?: UserDTO;
    }
  }
}
