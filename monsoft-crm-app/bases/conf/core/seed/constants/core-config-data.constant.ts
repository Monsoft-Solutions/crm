import { z } from 'zod';

import { InferInsertModel } from 'drizzle-orm';

import { coreConfTable } from '@db/db';

export const coreConfigData: InferInsertModel<typeof coreConfTable> = {
    id: 'core-config-id',

    randomTemplateDeterministic: true,

    resendApiKey: z.string().parse(process.env.MSS_RESEND_API_KEY),

    twilioSid: z.string().parse(process.env.MSS_TWILIO_SID),
    twilioToken: z.string().parse(process.env.MSS_TWILIO_TOKEN),
    twilioFrom: z.string().parse(process.env.MSS_TWILIO_FROM),

    langfuseBaseUrl: z.string().parse(process.env.LANGFUSE_BASE_URL),
    langfusePublicKey: z.string().parse(process.env.LANGFUSE_PUBLIC_KEY),
    langfuseSecretKey: z.string().parse(process.env.LANGFUSE_SECRET_KEY),

    anthropicApiKey: z.string().parse(process.env.ANTHROPIC_API_KEY),
};
