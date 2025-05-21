import { createAuthClient } from 'better-auth/react';
import {
    organizationClient,
    inferAdditionalFields,
} from 'better-auth/client/plugins';

import { authPath, userAdditionalFields } from '@auth/constants';

export const authClient = createAuthClient({
    basePath: authPath,

    plugins: [
        organizationClient(),

        inferAdditionalFields({
            user: userAdditionalFields,
        }),
    ],
});
