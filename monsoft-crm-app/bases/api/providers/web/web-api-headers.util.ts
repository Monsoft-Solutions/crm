import { Function } from '@errors/types';
import { Error, Success } from '@errors/utils';

import { authHeaderKey } from '@api/constants';

import { sessionIdToAuthHeader } from '@api/utils';

import { getWebSessionId, isWebSessionIdAvailable } from '@auth/providers/web';

// Utility to create headers for API requests from the browser
export const webApiHeaders = (() => {
    const { data: webSessionIdAvailable } = isWebSessionIdAvailable();

    if (!webSessionIdAvailable) {
        const emptyHeaders: Record<string, string> = {};

        return Success(emptyHeaders);
    }

    const { data: sessionId, error: sessionIdError } = getWebSessionId();

    if (sessionIdError) return Error(sessionIdError);

    const { data: authHeader, error: authHeaderError } = sessionIdToAuthHeader({
        sessionId,
    });

    if (authHeaderError) return Error(authHeaderError);

    const headersWithAuth: Record<string, string> = {
        [authHeaderKey]: authHeader,
    };

    return Success(headersWithAuth);
}) satisfies Function<void, Record<string, string>>;
