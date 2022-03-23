import AuthRoles from '../auth-roles.enum';

interface UserResponseDTO {
  firstName: string;
  lastName: string;
  email: string;
  role: AuthRoles;
  id: string;
}

export default UserResponseDTO;
