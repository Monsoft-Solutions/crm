import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { organization } from 'better-auth/plugins';

import { db } from '@db/providers/server';

import { authPath } from '@auth/constants';

import { authEnv } from '@env/constants/auth-env.constant';

import { userAdditionalFields } from '@auth/constants';

import bcrypt from 'bcryptjs';

import { sendVerificationEmail as sendVerificationEmailUtil } from './send-verification-email.provider';

import { GoogleProfile } from '@auth/types';

export const authServer = betterAuth({
    basePath: authPath,

    secret: authEnv.MSS_AUTH_SECRET,

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

        requireEmailVerification: true,
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
        sendOnSignUp: true,

        autoSignInAfterVerification: true,

        async sendVerificationEmail({ user: { name, email }, url }) {
            await sendVerificationEmailUtil({
                email,
                firstName: name,
                url,
            });
        },
    },
});

export { authServer as auth };
