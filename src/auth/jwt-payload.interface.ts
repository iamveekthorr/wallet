import AuthRoles from './auth-roles.enum';

interface JWTPayload {
  role: AuthRoles;
  email: string;
}

export default JWTPayload;
