import { eq, inArray } from 'drizzle-orm';

import { Success } from '@errors/utils';

import { protectedEndpoint } from '@api/providers/server';
import { queryMutationCallback } from '@api/providers/server/query-mutation-callback.provider';

import { setCustomConf } from '@conf/providers/server';

import tables from '@db/db';

import { updateTwilioCredentialsSchema } from '../schemas';

export const updateTwilioCredentials = protectedEndpoint
    .input(updateTwilioCredentialsSchema)
    .mutation(
        queryMutationCallback(
            async ({
                ctx: {
                    session: {
                        user: { organizationId },
                    },
                },
                input: { twilioSid, twilioToken },
                db,
            }) => {
                // Clear stale brand phone number assignments for this org.
                // When credentials change, the old numbers belong to a
                // different Twilio account and will cause send failures.
                const orgBrandIds = db
                    .select({ id: tables.brand.id })
                    .from(tables.brand)
                    .where(eq(tables.brand.organizationId, organizationId));

                await db
                    .delete(tables.brandPhoneNumber)
                    .where(
                        inArray(tables.brandPhoneNumber.brandId, orgBrandIds),
                    );

                await setCustomConf({
                    organizationId,
                    conf: { twilioSid, twilioToken },
                });

                return Success();
            },
        ),
    );
