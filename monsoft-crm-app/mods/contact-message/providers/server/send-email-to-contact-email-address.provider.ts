import { v4 as uuidv4 } from 'uuid';

import { Function } from '@errors/types';
import { Error, Success } from '@errors/utils';
import { catchError } from '@errors/utils/catch-error.util';

import { db } from '@db/providers/server';
import tables from '@db/db';

import { sendBrandEmail } from '@mods/brand/providers/send-brand-email.provider';

export const sendEmailToContactEmailAddress = (async ({
    contactEmailAddressId,
    username,
    subject,
    body,
}) => {
    const { data: contactEmailAddress, error: contactEmailAddressError } =
        await catchError(
            db.query.contactEmailAddress.findFirst({
                where: (record, { eq }) => eq(record.id, contactEmailAddressId),
                with: {
                    contact: {
                        with: {
                            brand: true,
                        },
                    },
                },
            }),
        );

    if (contactEmailAddressError) return Error();

    if (contactEmailAddress === undefined) return Error();

    const { contact, emailAddress } = contactEmailAddress;

    const { brandId } = contact;

    const { data: message, error: sendEmailError } = await sendBrandEmail({
        brandId,
        username,
        to: emailAddress,
        subject,
        body,
    });

    if (sendEmailError) return Error();

    const { sid } = message;

    const id = uuidv4();

    const { error: dbError } = await catchError(
        db.insert(tables.contactEmail).values({
            id,
            sid,
            contactEmailAddressId,
            direction: 'outbound',
            body,
        }),
    );

    if (dbError) return Error();

    const result = {
        id,
    };

    return Success(result);
}) satisfies Function<
    {
        contactEmailAddressId: string;
        username: string;
        subject: string;
        body: string;
    },
    { id: string }
>;
