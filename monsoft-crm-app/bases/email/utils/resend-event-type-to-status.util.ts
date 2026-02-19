import { ResendEventType } from '../../twilio/enums';

export const resendEventTypeToStatus = (
    eventType: Exclude<ResendEventType, 'email.received'>,
) => {
    switch (eventType) {
        case 'email.sent':
            return 'sent';

        case 'email.delivered':
            return 'delivered';

        case 'email.bounced':
        case 'email.complained':
            return 'failed';

        case 'email.delivery_delayed':
            return 'queued';
    }
};
