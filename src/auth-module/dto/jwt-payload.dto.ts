import AuthRoles from '../auth-roles.enum';

interface JWTPayloadDTO {
  role: AuthRoles;
  email: string;
  id: string;
}

export default JWTPayloadDTO;
