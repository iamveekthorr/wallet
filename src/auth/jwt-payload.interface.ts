import AuthRoles from './auth-roles.enum';

interface JWTPayload {
  role: AuthRoles;
  email: string;
  id: string;
}

export default JWTPayload;
