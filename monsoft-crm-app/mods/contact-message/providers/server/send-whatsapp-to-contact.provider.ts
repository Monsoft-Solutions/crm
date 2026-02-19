import { v4 as uuidv4 } from 'uuid';

import { Function } from '@errors/types';
import { Error, Success } from '@errors/utils';
import { catchError } from '@errors/utils/catch-error.util';

import { Tx } from '@db/types';

import tables from '@db/db';
import { sendBrandWhatsapp } from '@mods/brand/providers';

export const sendWhatsappToContact = (async ({ contactId, body, db }) => {
    const { data: contact, error: contactError } = await catchError(
        db.query.contact.findFirst({
            where: (record, { eq }) => eq(record.id, contactId),
            with: {
                phoneNumbers: {
                    where: (record, { eq }) => eq(record.isDefault, 'true'),
                },
            },
        }),
    );

    if (contactError) return Error();
    if (!contact) return Error();

    const { brandId, phoneNumbers } = contact;

    const defaultContactPhoneNumber = phoneNumbers.at(0)?.phoneNumber;

    if (!defaultContactPhoneNumber) return Error('NO_DEFAULT_PHONE_NUMBER');

    const { data: brandWhatsapp, error: brandWhatsappError } = await catchError(
        db.query.brandWhatsappNumber.findFirst({
            where: (record, { eq }) => eq(record.brandId, brandId),
        }),
    );

    if (brandWhatsappError) return Error();
    if (!brandWhatsapp) return Error('NO_BRAND_WHATSAPP_NUMBER');

    const { data: message, error: messageError } = await sendBrandWhatsapp({
        brandId,
        to: defaultContactPhoneNumber,
        body,
        db,
    });

    if (messageError) return Error();

    const { sid } = message;

    const id = uuidv4();

    const { error: dbError } = await catchError(
        db.insert(tables.contactMessage).values({
            id,
            externalId: sid,
            contactId,
            channel: 'whatsapp',
            fromAddress: brandWhatsapp.phoneNumber,
            toAddress: defaultContactPhoneNumber,
            direction: 'outbound',
            body,
        }),
    );

    if (dbError) return Error();

    return Success({ id });
}) satisfies Function<
    { contactId: string; body: string; db: Tx },
    { id: string }
>;
