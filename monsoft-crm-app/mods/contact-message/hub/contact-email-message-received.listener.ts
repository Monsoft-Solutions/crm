import { v4 as uuidv4 } from 'uuid';

import { catchError } from '@errors/utils/catch-error.util';

import { emit } from '@events/providers';
import { listen } from '@events/providers/listen.provider';

import { db } from '@db/providers/server';

import tables from '@db/db';

void listen(
    'resendInboundEmailReceived',

    async ({ from, to, subject, text, html, createdAt }) => {
        // Extract raw email from "Name <email>" format
        const fromEmail = from.includes('<')
            ? (from.match(/<(.+)>/)?.[1] ?? from)
            : from;

        const toEmail = to.includes('<')
            ? (to.match(/<(.+)>/)?.[1] ?? to)
            : to;

        // Find the brand by matching the "to" email with brand email addresses
        const { data: brandEmailAddresses, error: brandEmailError } =
            await catchError(
                db.query.brandEmailAddress.findMany({
                    with: {
                        domain: {
                            with: {
                                brand: true,
                            },
                        },
                    },
                }),
            );

        if (brandEmailError) return;

        const matchedBrandEmail = brandEmailAddresses.find(
            ({ username, domain: { domain } }) =>
                `${username}@${domain}` === toEmail,
        );

        if (!matchedBrandEmail) return;

        const { brand } = matchedBrandEmail.domain;

        // Find matching contact by sender email, scoped to this brand
        const { data: contactEmailAddresses, error: contactEmailError } =
            await catchError(
                db.query.contactEmailAddress.findMany({
                    where: (record, { eq }) =>
                        eq(record.emailAddress, fromEmail),
                    with: {
                        contact: true,
                    },
                }),
            );

        if (contactEmailError) return;

        const matchedContactEmail = contactEmailAddresses.find(
            (ce) => ce.contact.brandId === brand.id,
        );

        let contactId: string;

        if (matchedContactEmail) {
            contactId = matchedContactEmail.contactId;
        } else {
            // Create new contact + email address
            contactId = uuidv4();

            const { error: insertContactError } = await catchError(
                db.insert(tables.contact).values({
                    id: contactId,
                    brandId: brand.id,
                    firstName: '',
                    lastName: '',
                    assistantId: brand.defaultAssistantId,
                }),
            );

            if (insertContactError) return;

            const { error: insertEmailError } = await catchError(
                db.insert(tables.contactEmailAddress).values({
                    id: uuidv4(),
                    contactId,
                    emailAddress: fromEmail,
                }),
            );

            if (insertEmailError) return;

            emit({
                event: 'newContact',
                payload: {
                    brandId: brand.id,
                },
            });
        }

        // Prefer plain text for storage; fall back to HTML
        const body = text || html || '';

        const messageId = uuidv4();

        const { error: insertMessageError } = await catchError(
            db.insert(tables.contactMessage).values({
                id: messageId,
                contactId,
                channel: 'email',
                fromAddress: fromEmail,
                toAddress: toEmail,
                direction: 'inbound',
                subject,
                body,
                createdAt,
            }),
        );

        if (insertMessageError) return;

        emit({
            event: 'newContactMessage',
            payload: {
                id: messageId,
                contactId,
                channelType: 'email',
                direction: 'inbound',
                body,
                createdAt,
            },
        });
    },
);
