import { InferSelectModel } from 'drizzle-orm';

import { Function } from '@errors/types';
import { Error, Success } from '@errors/utils';
import { catchError } from '@errors/utils/catch-error.util';

import { Tx } from '@db/types';

import { contactWhatsappMessage } from '@db/db';

export const getContactWhatsappMessages = (async ({ contactId, db }) => {
    const { data: whatsappMessages, error: whatsappMessagesError } =
        await catchError(
            db.query.contactWhatsappMessage.findMany({
                where: (record, { eq }) => eq(record.contactId, contactId),
            }),
        );

    if (whatsappMessagesError) return Error();

    return Success(whatsappMessages);
}) satisfies Function<
    { contactId: string; db: Tx },
    InferSelectModel<typeof contactWhatsappMessage>[]
>;
