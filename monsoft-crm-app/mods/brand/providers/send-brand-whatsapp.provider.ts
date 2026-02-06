import { Function } from '@errors/types';
import { Error, Success } from '@errors/utils';
import { catchError } from '@errors/utils/catch-error.util';

import { Tx } from '@db/types';

import { sendWhatsapp } from '@twilio-whatsapp/providers';

import { getTwilioClientOrg } from '@twilio/providers';

export const sendBrandWhatsapp = (async ({ brandId, to, body, db }) => {
    const { data: brand, error: brandError } = await catchError(
        db.query.brand.findFirst({
            where: (record, { eq }) => eq(record.id, brandId),
            with: {
                whatsappNumbers: {
                    where: (record, { eq }) => eq(record.isDefault, 'true'),
                    limit: 1,
                },
            },
        }),
    );

    if (brandError) return Error();

    if (!brand) return Error();

    const { organizationId, whatsappNumbers } = brand;

    let defaultWhatsappNumber = whatsappNumbers.at(0)?.phoneNumber;

    if (!defaultWhatsappNumber) {
        const { data: fallbackBrand, error: fallbackError } = await catchError(
            db.query.brand.findFirst({
                where: (record, { eq }) => eq(record.id, brandId),
                with: {
                    whatsappNumbers: {
                        limit: 1,
                    },
                },
            }),
        );

        if (!fallbackError && fallbackBrand) {
            defaultWhatsappNumber =
                fallbackBrand.whatsappNumbers.at(0)?.phoneNumber;
        }
    }

    if (!defaultWhatsappNumber) return Error('NO_DEFAULT_WHATSAPP_NUMBER');

    const { data: client, error: clientError } = await getTwilioClientOrg({
        organizationId,
    });

    if (clientError) return Error();

    const { data: message, error: messageError } = await sendWhatsapp({
        client,
        from: defaultWhatsappNumber,
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
    { brandId: string; to: string; body: string; db: Tx },
    { sid: string }
>;
