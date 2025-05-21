import { Function } from '@errors/types';
import { Success } from '@errors/utils';

import { sessionIdStorageKey } from '@auth/constants/web';

// Remove user session ID from browser session storage
export const removeWebSessionId = (() => {
    localStorage.removeItem(sessionIdStorageKey);

    return Success();
}) satisfies Function;
