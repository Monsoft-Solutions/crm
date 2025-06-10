import { ReactElement } from 'react';

import { v4 as uuidv4 } from 'uuid';

import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools/production';

import * as Sentry from '@sentry/react';

import { toast } from 'sonner';

import { Function } from '@errors/types';
import { Success } from '@errors/utils';

import { LogInCredentials } from '@auth/schemas';

import { router } from '@web/router';

import { User } from '@guard/types';

// import { trackLogin } from '@analytics/providers';

import { authClient } from '@auth/providers/web';

// show devtools only in development
const showDevTools = process.env.NODE_ENV === 'development';

// log-in method
const logIn = async (credentials: LogInCredentials) => {
    // create server-side (db) session
    const logInResult = await authClient.signIn.email({
        email: credentials.email,
        password: credentials.password,
        rememberMe: true,
    });

    const { error } = logInResult;

    // if invalid credentials
    if (error?.code === authClient.$ERROR_CODES.INVALID_EMAIL_OR_PASSWORD) {
        toast.error('Invalid username or password', {
            description: 'Please check your credentials and try again',
        });
        return false;
    }
    // otherwise...

    // check if session failed (e.g. wrong credentials)
    if (error) {
        toast.error('Something went wrong', {
            description: 'Unexpected error ocurred, please try again',
        });
        return false;
    }
    // otherwise...

    // const { data: session } = logInResult;

    // const { user } = session;

    // invalidate the whole router
    // rerunning loader/beforLoad for all routes
    // to update route permission guards
    await router.invalidate();

    // trackLogin(user.id);

    return true;
};

// log-out method
const logOut = async () => {
    // remove server-side (db) session
    await authClient.signOut();

    // invalidate the whole router
    // rerunning loader/beforLoad for all routes
    // to update route permission guards
    await router.invalidate();
};

const getLoggedInUser = (async () => {
    // retrive the session object
    const { data: sessionData } = await authClient.getSession();

    if (!sessionData) return Success(null);

    const {
        session: { activeOrganizationId },
        user: rawUser,
    } = sessionData;

    let organizationId: string | null = null;

    if (activeOrganizationId) {
        organizationId = activeOrganizationId;
    } else {
        const { data: organizations, error: errorOrganizations } =
            await authClient.organization.list({
                query: {
                    userId: rawUser.id,
                },
            });

        if (errorOrganizations) {
            toast.error('Something went wrong fetching your organizations', {
                description: 'Unexpected error ocurred, please try again',
            });
        }

        const defaultOrganization = organizations?.at(0);

        if (defaultOrganization) {
            organizationId = defaultOrganization.id;
        } else {
            const { data: newOrganization, error: createOrganizationError } =
                await authClient.organization.create({
                    name: `${rawUser.name}'s Organization`,
                    slug: `${rawUser.name.replace(' ', '-').toLowerCase()}-org-${uuidv4()}`,
                });

            if (createOrganizationError) {
                toast.error('Error creating organization', {
                    description: 'Unexpected error ocurred, please try again',
                });
                return Success(null);
            }

            organizationId = newOrganization.id;
        }
    }

    if (!organizationId) return Success(null);

    await authClient.organization.setActive({
        organizationId,
    });

    const user = {
        ...rawUser,
        organizationId,
        roles: [],
    };

    Sentry.setUser({
        id: user.id,
    });

    return Success(user);
}) satisfies Function<void, User | null>;

export const Route = createRootRoute({
    beforeLoad: () => {
        // provide auth methods as router context
        return {
            auth: {
                getLoggedInUser,
                logIn,
                logOut,
            },
        };
    },

    component: function View(): ReactElement {
        return (
            <>
                {/* just render the matched children route */}
                <Outlet />

                {/* development tools for router and query engines */}
                {/* not rendered on production builds */}
                {showDevTools && (
                    <>
                        <ReactQueryDevtools
                            position="bottom"
                            buttonPosition="top-left"
                        />

                        <TanStackRouterDevtools position="top-left" />
                    </>
                )}
            </>
        );
    },
});
