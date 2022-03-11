import AuthRoles from '../../auth/auth-roles.enum';

interface UserDTO {
  id: string;
  firstName: string;
  lastName: string;
  role: AuthRoles;
  password: string;
  email: string;
}

export default UserDTO;
