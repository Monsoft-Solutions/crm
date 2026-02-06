import { Function } from '@errors/types';
import { Error, Success } from '@errors/utils';
import { catchError } from '@errors/utils/catch-error.util';

import { Tx } from '@db/types';

import { sendSms } from '@sms/providers';

import { getTwilioClientOrg } from '@twilio/providers';

export const sendBrandSms = (async ({ brandId, to, body, db }) => {
    const { data: brand, error: brandError } = await catchError(
        db.query.brand.findFirst({
            where: (record, { eq }) => eq(record.id, brandId),
            with: {
                phoneNumbers: {
                    where: (record, { eq }) => eq(record.isDefault, 'true'),
                    limit: 1,
                },
            },
        }),
    );

    if (brandError) return Error();

    if (!brand) return Error();

    const { organizationId, phoneNumbers } = brand;

    let defaultPhoneNumber = phoneNumbers.at(0)?.phoneNumber;

    if (!defaultPhoneNumber) {
        const { data: fallbackBrand, error: fallbackError } = await catchError(
            db.query.brand.findFirst({
                where: (record, { eq }) => eq(record.id, brandId),
                with: {
                    phoneNumbers: {
                        limit: 1,
                    },
                },
            }),
        );

        if (!fallbackError && fallbackBrand) {
            defaultPhoneNumber = fallbackBrand.phoneNumbers.at(0)?.phoneNumber;
        }
    }

    if (!defaultPhoneNumber) return Error();

    const { data: client, error: clientError } = await getTwilioClientOrg({
        organizationId,
    });

    if (clientError) return Error();

    const { data: message, error: messageError } = await sendSms({
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
    { brandId: string; to: string; body: string; db: Tx },
    { sid: string }
>;
