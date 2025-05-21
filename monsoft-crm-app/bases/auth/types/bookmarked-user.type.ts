import type { Role } from '@guard/types';

// Bookmarked user type
export type BookmarkedUser = {
    id: string;
    name: string;
    email: string;
    roles: Role[];
};
