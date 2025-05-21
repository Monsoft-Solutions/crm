import type { Role } from '@guard/types';

// type of the user objects used to determine permissions
export type User = {
    // the user's id
    id: string;

    // the user's organization id
    organizationId: string;

    // array of the user's roles
    roles: Role[];
};
