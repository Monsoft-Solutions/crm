import { Error, Success } from '@errors/utils';

import { protectedEndpoint } from '@api/providers/server';
import { queryMutationCallback } from '@api/providers/server/query-mutation-callback.provider';

import { sendMessageToContactSchema } from '../schemas';

import {
    sendSmsToContact,
    sendAppWhatsappToContact,
    sendEmailToContact,
} from '../providers/server';

import { emit } from '@events/providers';

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
                        const { data: emailMessage, error } =
                            await sendEmailToContact({
                                contactId,
                                subject: '',
                                body,
                            });

                        if (error) return Error();

                        id = emailMessage.id;

                        break;
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
