import { Function } from '@errors/types';
import { Error, Success } from '@errors/utils';
import { catchError } from '@errors/utils/catch-error.util';

import { db } from '@db/providers/server';

import { getTwilioClientOrg } from '@twilio/providers';

import { sendWhatsapp } from '@whatsapp/providers';

export const sendBrandWhatsapp = (async ({ brandId, to, body }) => {
    const { data: brand, error: brandError } = await catchError(
        db.query.brand.findFirst({
            where: (record, { eq }) => eq(record.id, brandId),
            with: {
                phoneNumbers: true,
            },
        }),
    );

    if (brandError) return Error();

    if (!brand) return Error();

    const { organizationId, phoneNumbers } = brand;

    const defaultPhoneNumber = phoneNumbers.at(0)?.phoneNumber;

    if (!defaultPhoneNumber) return Error();

    const { data: client, error: clientError } = await getTwilioClientOrg({
        organizationId,
    });

    if (clientError) return Error();

    const { data: message, error: messageError } = await sendWhatsapp({
        client,
        from: defaultPhoneNumber,
        to,
        body,
    });

    if (messageError) return Error();

    const { sid } = message;

    const result = {
        sid,
    };

    return Success(result);
}) satisfies Function<
    { brandId: string; to: string; body: string },
    { sid: string }
>;
