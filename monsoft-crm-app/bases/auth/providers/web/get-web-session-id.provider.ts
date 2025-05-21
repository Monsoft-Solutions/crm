import { Function } from '@errors/types';
import { Error, Success } from '@errors/utils';

import { sessionIdStorageKey } from '@auth/constants/web';

// Get user session ID from browser session storage
export const getWebSessionId = (() => {
    const sessionId = localStorage.getItem(sessionIdStorageKey);

    if (!sessionId) return Error('WEB_SESSION_ID_NOT_FOUND');

    return Success(sessionId);
}) satisfies Function<void, string>;
