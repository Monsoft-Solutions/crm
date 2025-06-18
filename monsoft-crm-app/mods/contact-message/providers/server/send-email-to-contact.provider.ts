import { Function } from '@errors/types';
import { Error, Success } from '@errors/utils';
import { catchError } from '@errors/utils/catch-error.util';

import { db } from '@db/providers/server';

import { sendEmailToContactEmailAddress } from './send-email-to-contact-email-address.provider';

export const sendEmailToContact = (async ({
    contactId,
    username,
    subject,
    body,
}) => {
    const { data: contactEmailAddress, error: contactEmailAddressError } =
        await catchError(
            db.query.contactEmailAddress.findFirst({
                where: (record, { eq }) => eq(record.contactId, contactId),
            }),
        );

    if (contactEmailAddressError) return Error();
    if (!contactEmailAddress) return Error();

    const { id: contactEmailAddressId } = contactEmailAddress;

    const { data, error } = await sendEmailToContactEmailAddress({
        username,
        contactEmailAddressId,
        subject,
        body,
    });

    if (error) return Error();

    return Success(data);
}) satisfies Function<
    {
        username: string;
        contactId: string;
        subject: string;
        body: string;
    },
    { id: string }
>;
