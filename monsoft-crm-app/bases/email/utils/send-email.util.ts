import { Resend } from 'resend';

import { Function } from '@errors/types';
import { Success, Error } from '@errors/utils';

import { getCoreConf } from '@conf/providers/server';

type SendEmailProps = Parameters<typeof Resend.prototype.emails.send>[0];

export const sendEmail = (async (props: SendEmailProps) => {
    const coreConfWithError = await getCoreConf();

    const { error: coreConfError } = coreConfWithError;

    if (coreConfError !== null) return Error('MISSING_CORE_CONF');

    const { data: coreConf } = coreConfWithError;

    const { resendApiKey } = coreConf;

    const resend = new Resend(resendApiKey);

    const { data, error } = await resend.emails.send(props);

    if (error) return Error();

    if (data === null) return Error();

    const { id: sid } = data;

    return Success({ sid });
}) satisfies Function<SendEmailProps, { sid: string }>;
