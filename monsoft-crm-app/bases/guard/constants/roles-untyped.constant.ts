import * as appRoles from '@app/guard';

// the different roles that a user can have
export const rolesUntyped = Object.values(appRoles).flat();
