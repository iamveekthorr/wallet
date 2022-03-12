import AuthRoles from '../auth/auth-roles.enum';

export type JTWDecoded = {
  sub: string;
  email: string;
  role: AuthRoles;
};
