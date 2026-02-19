import { v4 as uuidv4 } from 'uuid';

import { Function } from '@errors/types';
import { Error, Success } from '@errors/utils';
import { catchError } from '@errors/utils/catch-error.util';

import { Tx } from '@db/types';

import tables from '@db/db';

import { sendBrandEmail } from '@mods/brand/providers/send-brand-email.provider';

export const sendEmailToContact = (async ({ contactId, subject, body, db }) => {
    const { data: contact, error: contactError } = await catchError(
        db.query.contact.findFirst({
            where: (record, { eq }) => eq(record.id, contactId),
            with: {
                emailAddresses: true,
                brand: {
                    with: {
                        domains: {
                            with: {
                                emailAddresses: true,
                            },
                        },
                    },
                },
            },
        }),
    );

    if (contactError) return Error();
    if (!contact) return Error();

    const { brandId, emailAddresses, brand } = contact;

    const defaultContactEmailAddress = emailAddresses.at(0);

    if (!defaultContactEmailAddress) return Error('NO_DEFAULT_EMAIL_ADDRESS');

    const { emailAddress } = defaultContactEmailAddress;

    const brandEmailAddresses = brand.domains.flatMap(
        ({ domain, emailAddresses: addrs }) =>
            addrs.map(({ username }) => `${username}@${domain}`),
    );

    const fromAddress = brandEmailAddresses.at(0) ?? '';

    const { data: message, error: messageError } = await sendBrandEmail({
        brandId,
        subject,
        to: emailAddress,
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
            channel: 'email',
            fromAddress,
            toAddress: emailAddress,
            subject,
            direction: 'outbound',
            body,
        }),
    );

    if (dbError) return Error();

    return Success({ id });
}) satisfies Function<
    {
        contactId: string;
        subject: string;
        body: string;
        db: Tx;
    },
    { id: string }
>;
