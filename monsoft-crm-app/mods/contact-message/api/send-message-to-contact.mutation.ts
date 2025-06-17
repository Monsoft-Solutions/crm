import { Error, Success } from '@errors/utils';

import { protectedEndpoint } from '@api/providers/server';
import { queryMutationCallback } from '@api/providers/server/query-mutation-callback.provider';

import { sendMessageToContactSchema } from '../schemas';

import { sendSmsToContact } from '../providers/server';
import { sendAppWhatsappToContact } from '../providers/server';

import { emit } from '@events/providers';

const NOT_IMPLEMENTED_CHANNEL_TYPE = Error('NOT_IMPLEMENTED_CHANNEL_TYPE');

export const sendMessageToContact = protectedEndpoint
    .input(sendMessageToContactSchema)
    .mutation(
        queryMutationCallback(
            async ({ input: { contactId, channelType, body } }) => {
                let id: string;

                switch (channelType) {
                    case 'sms': {
                        const { data: smsMessage, error } =
                            await sendSmsToContact({
                                contactId,
                                body,
                            });

                        if (error) return Error();

                        id = smsMessage.id;
                        break;
                    }

                    case 'email': {
                        return NOT_IMPLEMENTED_CHANNEL_TYPE;
                    }

                    case 'whatsapp': {
                        const { data: smsMessage, error } =
                            await sendAppWhatsappToContact({
                                contactId,
                                body,
                            });

                        if (error) return Error();

                        id = smsMessage.id;
                        break;
                    }

                    case 'instagram': {
                        return NOT_IMPLEMENTED_CHANNEL_TYPE;
                    }

                    case 'slack': {
                        return NOT_IMPLEMENTED_CHANNEL_TYPE;
                    }
                }

                emit({
                    event: 'newContactMessage',
                    payload: {
                        id,
                        contactId,
                        channelType,
                        direction: 'outbound',
                        body,
                        createdAt: Date.now(),
                    },
                });

                return Success();
            },
        ),
    );
