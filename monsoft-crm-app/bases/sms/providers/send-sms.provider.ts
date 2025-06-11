import { Twilio } from 'twilio';

import { Function } from '@errors/types';
import { Error, Success } from '@errors/utils';
import { catchError } from '@errors/utils/catch-error.util';

export const sendSms = (async ({ client, from, to, body }) => {
    const { data: message, error: messageError } = await catchError(
        client.messages.create({
            body,
            from,
            to,
        }),
    );

    if (messageError) return Error();

    const { sid } = message;

    const result = {
        sid,
    };

    return Success(result);
}) satisfies Function<
    { client: Twilio; from: string; to: string; body: string },
    { sid: string }
>;
