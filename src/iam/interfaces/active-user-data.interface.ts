import { Role } from 'src/users/enums/role.enum';
import { PermissionType } from '../authorization/permission.type';

export interface ActiveUserData {
  sub: number;
  email: string;
  role: Role;
  //No make sense to use both properties the same time. Just for demonstration of Claims-based authorization.
  permissions: PermissionType[];
}
