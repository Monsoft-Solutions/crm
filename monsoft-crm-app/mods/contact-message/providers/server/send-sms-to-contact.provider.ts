import { v4 as uuidv4 } from 'uuid';

import twilio from 'twilio';

import { Function } from '@errors/types';
import { Error, Success } from '@errors/utils';
import { catchError } from '@errors/utils/catch-error.util';

import { db } from '@db/providers/server';
import tables from '@db/db';

import { getCoreConf } from '@conf/providers/server';

export const sendSmsToContact = (async ({ contactPhoneNumberId, body }) => {
    const { data: coreConf, error: coreConfError } = await getCoreConf();

    if (coreConfError) return Error();

    const { twilioSid, twilioToken, twilioFrom } = coreConf;

    const { data: contactPhoneNumber, error: contactPhoneNumberError } =
        await catchError(
            db.query.contactPhoneNumber.findFirst({
                where: (record, { eq }) => eq(record.id, contactPhoneNumberId),
            }),
        );

    if (contactPhoneNumberError) return Error();

    if (contactPhoneNumber === undefined) return Error();

    const { phoneNumber } = contactPhoneNumber;

    const client = twilio(twilioSid, twilioToken);

    await client.messages.create({
        body,
        from: twilioFrom,
        to: phoneNumber,
    });

    const id = uuidv4();

    const contactSms = {
        id,
        contactPhoneNumberId,
        body,
    };

    const { error: dbError } = await catchError(
        db.insert(tables.contactSmsMessage).values(contactSms),
    );

    if (dbError) return Error();

    return Success();
}) satisfies Function<{ contactPhoneNumberId: string; body: string }>;
