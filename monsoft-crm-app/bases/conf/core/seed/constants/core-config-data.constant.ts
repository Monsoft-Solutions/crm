import { z } from 'zod';

import { InferInsertModel } from 'drizzle-orm';

import { coreConfTable } from '@db/db.tables';

export const coreConfigData: InferInsertModel<typeof coreConfTable> = {
    id: 'core-config-id',
    name: 'core config',
    usage: 'current',
    randomTemplateDeterministic: true,

    resendApiKey: z.string().parse(process.env.MSS_RESEND_API_KEY),
};
