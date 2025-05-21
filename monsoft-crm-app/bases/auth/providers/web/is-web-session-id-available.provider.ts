import { Function } from '@errors/types';
import { Success } from '@errors/utils';

import { sessionIdStorageKey } from '@auth/constants/web';

// check if there is a session ID available in the browser session storage
export const isWebSessionIdAvailable = (() => {
    const sessionIdStorageValue = localStorage.getItem(sessionIdStorageKey);

    const isAvaliable = sessionIdStorageValue !== null;

    return Success(isAvaliable);
}) satisfies Function<void, boolean>;
