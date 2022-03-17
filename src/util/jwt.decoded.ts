import AuthRoles from '../auth-module/auth-roles.enum';

export type JTWDecoded = {
  sub: string;
  email: string;
  role: AuthRoles;
  exp?: number;
};
