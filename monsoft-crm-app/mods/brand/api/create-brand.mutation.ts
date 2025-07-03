import { v4 as uuidv4 } from 'uuid';

import { Error, Success } from '@errors/utils';
import { catchError } from '@errors/utils/catch-error.util';

import { protectedEndpoint } from '@api/providers/server';
import { queryMutationCallback } from '@api/providers/server/query-mutation-callback.provider';

import tables from '@db/db';

import { getTwilioClientOrg } from '@twilio/providers';

import { createBrandSchema } from '../schemas';

export const createBrand = protectedEndpoint.input(createBrandSchema).mutation(
    queryMutationCallback(
        async ({
            ctx: {
                session: {
                    user: { organizationId },
                },
            },
            input: {
                name,
                phoneNumber,
                domain,
                whatsappPhoneId,
                whatsappPhoneNumber,
            },
            db,
        }) => {
            const id = uuidv4();

            const { data: client, error: clientError } =
                await getTwilioClientOrg({
                    organizationId,
                });

            if (clientError) return Error();

            const purchasedNumber = await client.incomingPhoneNumbers.create({
                phoneNumber,
            });

            const brandPhoneNumber = purchasedNumber.phoneNumber;

            const { error } = await catchError(
                db.transaction(async (tx) => {
                    await tx.insert(tables.brand).values({
                        id,
                        organizationId,
                        name,
                    });

                    await tx.insert(tables.brandPhoneNumber).values({
                        id: uuidv4(),
                        brandId: id,
                        phoneNumber: brandPhoneNumber,
                    });

                    await tx.insert(tables.brandWhatsappNumber).values({
                        id: uuidv4(),
                        brandId: id,
                        phoneId: whatsappPhoneId,
                        phoneNumber: whatsappPhoneNumber,
                    });

                    const brandDomainId = uuidv4();

                    await tx.insert(tables.brandDomain).values({
                        id: brandDomainId,
                        brandId: id,
                        domain,
                    });

                    await tx.insert(tables.brandEmailAddress).values({
                        id: uuidv4(),
                        brandDomainId,
                        username: 'test-email',
                    });
                }),
            );

            if (error) return Error();

            return Success({ brandId: id });
        },
    ),
);
