import { Function } from '@errors/types';
import { Error, Success } from '@errors/utils';
import { catchError } from '@errors/utils/catch-error.util';

import { db } from '@db/providers/server';

import { getCustomConf } from '@conf/providers/server';

import { sendWhatsapp } from '@whatsapp/providers';

export const sendBrandWhatsapp = (async ({ brandId, to, body }) => {
    const { data: brand, error: brandError } = await catchError(
        db.query.brand.findFirst({
            where: (record, { eq }) => eq(record.id, brandId),
            with: {
                whatsappNumbers: true,
            },
        }),
    );

    if (brandError) return Error();

    if (!brand) return Error();

    const { organizationId, whatsappNumbers } = brand;

    const defaultWhatsappNumber = whatsappNumbers.at(0);

    if (!defaultWhatsappNumber) return Error('NO_DEFAULT_WHATSAPP_NUMBER');

    const { data: customConf, error: customConfError } = await getCustomConf({
        organizationId,
    });

    if (customConfError) return Error();

    const { whatsappToken } = customConf;

    if (!whatsappToken) return Error();

    const { data: message, error: messageError } = await sendWhatsapp({
        authToken: whatsappToken,
        fromPhoneId: defaultWhatsappNumber.phoneId,
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
