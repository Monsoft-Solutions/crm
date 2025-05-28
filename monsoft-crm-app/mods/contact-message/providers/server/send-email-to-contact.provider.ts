import { v4 as uuidv4 } from 'uuid';

import { Function } from '@errors/types';
import { Error, Success } from '@errors/utils';
import { catchError } from '@errors/utils/catch-error.util';

import { db } from '@db/providers/server';
import tables from '@db/db';

import { sendEmail } from '@email/utils/send-email.util';

import { sendEmailToContactFromAddress } from '@mods/contact-message/constants';

export const sendEmailToContact = (async ({ contactEmailAddressId, body }) => {
    const { data: contactEmailAddress, error: contactEmailAddressError } =
        await catchError(
            db.query.contactEmailAddress.findFirst({
                where: (record, { eq }) => eq(record.id, contactEmailAddressId),
            }),
        );

    if (contactEmailAddressError) return Error();

    if (contactEmailAddress === undefined) return Error();

    const { emailAddress } = contactEmailAddress;

    const { error: sendEmailError } = await sendEmail({
        from: sendEmailToContactFromAddress,
        to: emailAddress,
        subject: '',
        text: body,
    });

    if (sendEmailError) return Error();

    const id = uuidv4();

    const contactEmail = {
        id,
        contactEmailAddressId,
        body,
    };

    const { error: dbError } = await catchError(
        db.insert(tables.contactEmail).values(contactEmail),
    );

    if (dbError) return Error();

    return Success();
}) satisfies Function<{ contactEmailAddressId: string; body: string }>;
