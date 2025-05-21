// Utilities to convert between auth header and session ID

import { Function } from '@errors/types';
import { Error, Success } from '@errors/utils';

const authHeaderLabel = 'bearer';

const authHeaderSeparator = ' ';

// Convert an auth header to a session ID
export const authHeaderToSessionId = (({ authHeader }) => {
    const words = authHeader.split(authHeaderSeparator);

    const sessionId = words.at(1);

    if (!sessionId || words.at(0) !== authHeaderLabel || words.length !== 2)
        return Error('INVALID_FORMAT');

    return Success(sessionId);
}) satisfies Function<{ authHeader: string }, string>;

// Convert a session ID to an auth header
export const sessionIdToAuthHeader = (({ sessionId }) => {
    if (sessionId.length === 0) return Error('EMPTY_SESSION_ID');

    const authHeader = [authHeaderLabel, sessionId].join(authHeaderSeparator);

    return Success(authHeader);
}) satisfies Function<{ sessionId: string }, string>;
