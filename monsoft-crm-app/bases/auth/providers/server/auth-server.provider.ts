import { z } from 'zod';

import { v4 as uuidv4 } from 'uuid';

import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { createAuthMiddleware, organization } from 'better-auth/plugins';

import { catchError } from '@errors/utils/catch-error.util';

import { db } from '@db/providers/server';

import { authPath } from '@auth/constants';

import { authEnv } from '@env/constants/auth-env.constant';

import { userAdditionalFields } from '@auth/constants';

import bcrypt from 'bcryptjs';

import { sendVerificationEmail as sendVerificationEmailUtil } from './send-verification-email.provider';

import { GoogleProfile } from '@auth/types';

import tables from '@db/db';

import { createTwilioSubaccount } from '@twilio/providers';

import { createTwilioOrgSink } from '@twilio/providers';

import { appUrl } from '@dist/constants';

export const authServer = betterAuth({
    basePath: authPath,

    secret: authEnv.MSS_AUTH_SECRET,

    trustedOrigins: [appUrl, 'https://wise-mastiff-sharing.ngrok-free.app'],

    database: drizzleAdapter(db, {
        provider: 'pg',
    }),

    plugins: [organization()],

    emailAndPassword: {
        enabled: true,

        password: {
            hash(password) {
                return bcrypt.hash(password, 10);
            },

            verify({ password, hash }) {
                return bcrypt.compare(password, hash);
            },
        },

        requireEmailVerification: false,
    },

    socialProviders: {
        google: {
            clientId: authEnv.MSS_GOOGLE_ID,
            clientSecret: authEnv.MSS_GOOGLE_SECRET,

            mapProfileToUser: ({
                email,
                given_name,
                family_name,
            }: GoogleProfile) => {
                return {
                    email,
                    name: given_name,
                    lastName: family_name,
                };
            },
        },
    },

    user: {
        additionalFields: userAdditionalFields,
    },

    emailVerification: {
        sendOnSignUp: false,

        autoSignInAfterVerification: true,

        async sendVerificationEmail({ user: { name, email }, url }) {
            await sendVerificationEmailUtil({
                email,
                firstName: name,
                url,
            });
        },
    },

    hooks: {
        after: createAuthMiddleware(async (ctx) => {
            const { path } = ctx;

            switch (path) {
                case '/organization/create': {
                    const bodySchema = z.object({
                        slug: z.string(),
                    });

                    const parsedBody = bodySchema.safeParse(ctx.body).data;

                    if (!parsedBody) return;

                    const { slug } = parsedBody;

                    const { data: organization, error: organizationError } =
                        await catchError(
                            db.query.organization.findFirst({
                                where: (record, { eq }) =>
                                    eq(record.slug, slug),
                            }),
                        );

                    if (organizationError) return;

                    if (!organization) return;

                    const { id: organizationId, name: organizationName } =
                        organization;

                    const {
                        data: twilioSubaccount,
                        error: twilioSubaccountError,
                    } = await createTwilioSubaccount({
                        friendlyName: organizationName,
                    });

                    if (twilioSubaccountError) return;

                    const { sid: twilioSid, token: twilioToken } =
                        twilioSubaccount;

                    await db.insert(tables.customConfTable).values({
                        id: uuidv4(),
                        organizationId,

                        twilioSid,
                        twilioToken,
                    });

                    await createTwilioOrgSink({
                        organizationId,
                    });

                    break;
                }
            }
        }),
    },
});

export { authServer as auth };
