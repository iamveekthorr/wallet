import AuthRoles from '../auth-roles.enum';

interface AuthCredentialsDTO {
  role: AuthRoles.USER;
  firstName: string;
  lastName: string;
  password: string;
  email: string;
}

export default AuthCredentialsDTO;
