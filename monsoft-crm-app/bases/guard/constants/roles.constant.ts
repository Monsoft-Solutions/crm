import { rolesUntyped } from './roles-untyped.constant';

import { Role } from '@guard/types';

// the different roles that a user can have
export const roles = rolesUntyped as [Role, ...Role[]];
