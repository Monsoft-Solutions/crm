import type { CreateHTTPContextOptions } from '@trpc/server/adapters/standalone';

import { catchError } from '@errors/utils/catch-error.util';

import { db } from '@db/providers/server';
import { eq } from 'drizzle-orm';

import { authServer } from '@auth/providers/server';

// Server context created on every API request
export const apiContext = async ({ req }: CreateHTTPContextOptions) => {
    const headers = new Headers();

    Object.entries(req.headers).forEach(([key, value]) => {
        headers.append(key, value as string);
    });

    const sessionAndUser = await authServer.api.getSession({
        headers,
    });

    if (sessionAndUser === null) return { session: null };

    const {
        session: { activeOrganizationId: organizationId, ...rawSession },
        user: rawUser,
    } = sessionAndUser;

    if (!organizationId) return { session: null };

    const { data: userRoles, error: userRolesError } = await catchError(
        db.query.userRoleTable.findMany({
            where: ({ userId }) => eq(userId, rawUser.id),

            with: {
                role: true,
            },
        }),
    );

    if (userRolesError) return { session: null };

    const roles = userRoles.map(({ role }) => role.name);

    const user = {
        ...rawUser,
        organizationId,
        roles,
    };

    const session = {
        ...rawSession,
        user,
    };

    return { session };
};
