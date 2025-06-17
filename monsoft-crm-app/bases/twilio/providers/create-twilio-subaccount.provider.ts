import { Function } from '@errors/types';
import { Success, Error } from '@errors/utils';
import { catchError } from '@errors/utils/catch-error.util';

import { getTwilioClientMain } from './get-twilio-client-main.provider';

export const createTwilioSubaccount = (async ({ friendlyName }) => {
    const { data: mainClient, error: mainClientError } =
        await getTwilioClientMain();

    if (mainClientError) return Error();

    const { data: subaccount, error: subaccountError } = await catchError(
        mainClient.api.accounts.create({
            friendlyName,
        }),
    );

    if (subaccountError) return Error();

    const { sid, authToken: token } = subaccount;

    return Success({ sid, token });
}) satisfies Function<{ friendlyName: string }, { sid: string; token: string }>;
