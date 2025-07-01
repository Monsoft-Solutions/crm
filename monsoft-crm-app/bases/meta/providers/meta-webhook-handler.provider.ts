import express from 'express';

import { emit } from '@events/providers';

import { metaEventWebhookPath } from '../constants';

import {
    metaEventWebhookBodySchema,
    metaEventWebhookBodyMessagesFieldChangeValueSchema,
    metaEventNewWhatsappMessagesSchema,
    metaEventWhatsappMessagesStatusUpdateSchema,
} from '../schemas';

export function metaWebhookHandler(server: express.Express) {
    server.use(metaEventWebhookPath, express.urlencoded({ extended: false }));
    server.use(metaEventWebhookPath, express.json());

    // needed for verification in meta dashboard API setup
    server.get(metaEventWebhookPath, function (req, res) {
        if (
            req.query['hub.mode'] == 'subscribe' &&
            req.query['hub.verify_token'] == 'token'
        ) {
            res.send(req.query['hub.challenge']);
        } else {
            res.sendStatus(400);
        }
    });

    server.post(metaEventWebhookPath, (req, res) => {
        res.sendStatus(200);

        const parsedBody = metaEventWebhookBodySchema.parse(req.body);

        const { entry: entries } = parsedBody;

        for (const entry of entries) {
            const { changes } = entry;

            for (const change of changes) {
                const { field, value } = change;

                if (field !== 'messages') continue;

                const messagesFieldChangeValue =
                    metaEventWebhookBodyMessagesFieldChangeValueSchema.safeParse(
                        value,
                    ).data;

                if (!messagesFieldChangeValue) continue;

                const { messaging_product, metadata } =
                    messagesFieldChangeValue;

                if (messaging_product !== 'whatsapp') continue;

                const { phone_number_id: toPhoneNumberId } = metadata;

                const newMessages =
                    metaEventNewWhatsappMessagesSchema.safeParse(
                        messagesFieldChangeValue,
                    ).data;

                if (newMessages) {
                    const messages = newMessages.messages.map((message) => {
                        const rawContact = newMessages.contacts.at(0);

                        const contactName = rawContact?.profile.name ?? '';

                        const {
                            from,
                            text: { body },
                        } = message;

                        return {
                            contactName,
                            fromPhoneNumber: from,
                            toPhoneNumberId,
                            body,
                        };
                    });

                    for (const message of messages) {
                        emit({
                            event: 'whatsappMessageReceivedEvent',
                            payload: message,
                        });
                    }
                } else {
                    const messageStatusUpdates =
                        metaEventWhatsappMessagesStatusUpdateSchema.safeParse(
                            messagesFieldChangeValue,
                        ).data;

                    if (messageStatusUpdates) {
                        const { statuses } = messageStatusUpdates;

                        for (const status of statuses) {
                            emit({
                                event: 'whatsappMessageStatusUpdatedEvent',
                                payload: {
                                    sid: status.id,
                                    status: status.status,
                                },
                            });
                        }
                    }
                }
            }
        }
    });
}
