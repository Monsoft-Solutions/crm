import { z } from 'zod';

import { Success, Error } from '@errors/utils';
import { catchError } from '@errors/utils/catch-error.util';

import { protectedEndpoint } from '@api/providers/server';
import { queryMutationCallback } from '@api/providers/server/query-mutation-callback.provider';

import { contactChannelTypeEnum } from '../enums';

export const getAvailableContactChannels = protectedEndpoint
    .input(z.object({ contactId: z.string() }))
    .query(
        queryMutationCallback(async ({ input: { contactId }, db }) => {
            const { data: contact } = await catchError(
                db.query.contact.findFirst({
                    where: (record, { eq }) => eq(record.id, contactId),

                    with: {
                        phoneNumbers: true,
                        emailAddresses: true,

                        brand: {
                            with: {
                                phoneNumbers: true,
                                whatsappNumbers: true,
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

            if (!contact) return Error();

            const {
                phoneNumbers: contactPhoneNumbers,
                emailAddresses: contactEmailAddresses,
                brand,
            } = contact;

            const {
                domains: brandDomains,
                phoneNumbers: brandPhoneNumbers,
                whatsappNumbers: brandWhatsappNumbers,
            } = brand;

            const brandEmailAddresses = brandDomains.flatMap(
                ({ emailAddresses }) => emailAddresses,
            );

            const availableContactChannels =
                contactChannelTypeEnum.options.filter((type) => {
                    switch (type) {
                        case 'sms': {
                            return (
                                brandPhoneNumbers.length > 0 &&
                                contactPhoneNumbers.length > 0
                            );
                        }

                        case 'whatsapp':
                            return (
                                brandWhatsappNumbers.length > 0 &&
                                contactPhoneNumbers.length > 0
                            );

                        case 'email':
                            return (
                                brandEmailAddresses.length > 0 &&
                                contactEmailAddresses.length > 0
                            );
                    }
                });

            return Success(availableContactChannels);
        }),
    );
