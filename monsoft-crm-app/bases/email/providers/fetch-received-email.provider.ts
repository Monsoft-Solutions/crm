import { Error, Success } from '@errors/utils';
import { catchError } from '@errors/utils/catch-error.util';

import { getCoreConf } from '@conf/providers/server';

type ReceivedEmail = {
    id: string;
    from: string;
    to: string | string[];
    subject: string;
    text: string;
    html: string;
    created_at: string;
};

export const fetchReceivedEmail = async ({
    emailId,
}: {
    emailId: string;
}) => {
    const { data: conf, error: confError } = await getCoreConf();

    if (confError) return Error();

    const { data: response, error: fetchError } = await catchError(
        fetch(`https://api.resend.com/emails/receiving/${emailId}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${conf.resendApiKey}`,
                'Content-Type': 'application/json',
            },
        }),
    );

    if (fetchError) return Error();
    if (!response.ok) return Error();

    const { data: email, error: parseError } = await catchError(
        response.json() as Promise<ReceivedEmail>,
    );

    if (parseError) return Error();

    return Success(email);
};
