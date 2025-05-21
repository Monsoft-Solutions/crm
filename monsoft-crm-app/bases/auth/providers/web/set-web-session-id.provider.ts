import { Function } from '@errors/types';
import { Success } from '@errors/utils';

import { sessionIdStorageKey } from '@auth/constants/web';

// Set user session ID in browser session storage
export const setWebSessionId = (({ sessionId }) => {
    localStorage.setItem(sessionIdStorageKey, sessionId);

    return Success();
}) satisfies Function<{ sessionId: string }>;
