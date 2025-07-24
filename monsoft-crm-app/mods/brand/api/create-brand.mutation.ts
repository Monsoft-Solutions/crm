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
                description,
                industry,
                companySize,
                foundedYear,
                coreValues,
                personalityTraits,
                communicationStyle,
                languagePreferences,
                voiceGuidelines,
                prohibitedContent,
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

            const brandVoiceId = uuidv4();

            const { error: insertBrandVoiceError } = await catchError(
                db.insert(tables.brandVoice).values({
                    id: brandVoiceId,
                    coreValues,
                    personalityTraits,
                    communicationStyle,
                    languagePreferences,
                    voiceGuidelines,
                    prohibitedContent,
                }),
            );

            if (insertBrandVoiceError) return Error();

            const { error: insertBrandError } = await catchError(
                db.insert(tables.brand).values({
                    id,
                    organizationId,
                    name,
                    description,
                    industry,
                    companySize,
                    foundedYear,
                    brandVoiceId,
                }),
            );

            if (insertBrandError) return Error();

            const { error: insertBrandPhoneNumberError } = await catchError(
                db.insert(tables.brandPhoneNumber).values({
                    id: uuidv4(),
                    brandId: id,
                    phoneNumber: brandPhoneNumber,
                }),
            );

            if (insertBrandPhoneNumberError) return Error();

            const { error: insertBrandWhatsappNumberError } = await catchError(
                db.insert(tables.brandWhatsappNumber).values({
                    id: uuidv4(),
                    brandId: id,
                    phoneId: whatsappPhoneId,
                    phoneNumber: whatsappPhoneNumber,
                }),
            );

            if (insertBrandWhatsappNumberError) return Error();

            const brandDomainId = uuidv4();

            const { error: insertBrandDomainError } = await catchError(
                db.insert(tables.brandDomain).values({
                    id: brandDomainId,
                    brandId: id,
                    domain,
                }),
            );

            if (insertBrandDomainError) return Error();

            const { error: insertBrandEmailAddressError } = await catchError(
                db.insert(tables.brandEmailAddress).values({
                    id: uuidv4(),
                    brandDomainId,
                    username: 'test-email',
                }),
            );

            if (insertBrandEmailAddressError) return Error();

            return Success({ brandId: id });
        },
    ),
);
