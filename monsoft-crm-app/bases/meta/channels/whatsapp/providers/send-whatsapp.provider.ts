import axios from 'axios';

import { Function } from '@errors/types';
import { Error, Success } from '@errors/utils';
import { catchError } from '@errors/utils/catch-error.util';

import { sendWhatsappResponseSchema } from '@meta/schemas/send-whatsapp-response.schema';

export const sendWhatsapp = (async ({ authToken, fromPhoneId, to, body }) => {
    const { data: axiosRawData, error } = await catchError(
        axios.post(
            `https://graph.facebook.com/v19.0/${fromPhoneId}/messages`,
            {
                messaging_product: 'whatsapp',
                to,
                type: 'text',
                text: {
                    body,
                },
            },

            {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                },
            },
        ),
    );

    if (error) return Error();

    const parsedData = sendWhatsappResponseSchema.safeParse(axiosRawData.data);

    if (!parsedData.success) return Error('INVALID_RESPONSE');

    const { messages } = parsedData.data;

    const message = messages.at(0);

    if (!message) return Error('INVALID_RESPONSE');

    const { id: sid } = message;

    return Success({ sid });
}) satisfies Function<
    {
        authToken: string;
        fromPhoneId: string;
        to: string;
        body: string;
    },
    { sid: string }
>;
