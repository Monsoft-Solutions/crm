import { Function } from '@errors/types';
import { Error, Success } from '@errors/utils';
import { catchError } from '@errors/utils/catch-error.util';

import { db } from '@db/providers/server';

import { sendEmail } from '@email/utils';

export const sendBrandEmail = (async ({
    brandId,
    username,
    to,
    subject,
    body,
}) => {
    const { data: brand, error: brandError } = await catchError(
        db.query.brand.findFirst({
            where: (record, { eq }) => eq(record.id, brandId),
        }),
    );

    if (brandError) return Error();

    if (!brand) return Error();

    const { domain } = brand;

    const from = `${username}@${domain}`;

    const { error: messageError } = await sendEmail({
        from,
        to,
        subject,
        text: body,
    });

    if (messageError) return Error();

    return Success();
}) satisfies Function<
    {
        brandId: string;
        username: string;
        to: string;
        subject: string;
        body: string;
    },
    { sid: string }
>;
