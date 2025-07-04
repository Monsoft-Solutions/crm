import { Function } from '@errors/types';
import { Error, Success } from '@errors/utils';
import { catchError } from '@errors/utils/catch-error.util';

import { Tx } from '@db/types';

import { sendEmail } from '@email/utils';

export const sendBrandEmail = (async ({ brandId, to, subject, body, db }) => {
    const { data: brand, error: brandError } = await catchError(
        db.query.brand.findFirst({
            where: (record, { eq }) => eq(record.id, brandId),
            with: {
                domains: {
                    with: {
                        emailAddresses: true,
                    },
                },
            },
        }),
    );

    if (brandError) return Error();

    if (!brand) return Error();

    const brandEmailAddresses = brand.domains.flatMap(
        ({ domain, emailAddresses }) =>
            emailAddresses.map(({ username }) => `${username}@${domain}`),
    );

    const defaultEmailAddress = brandEmailAddresses.at(0);

    if (!defaultEmailAddress) return Error('NO_DEFAULT_EMAIL_ADDRESS');

    const { data: messsage, error: messageError } = await sendEmail({
        from: defaultEmailAddress,
        to,
        subject,
        text: body,
    });

    if (messageError) return Error();

    return Success(messsage);
}) satisfies Function<
    {
        brandId: string;
        to: string;
        subject: string;
        body: string;
        db: Tx;
    },
    { sid: string }
>;
