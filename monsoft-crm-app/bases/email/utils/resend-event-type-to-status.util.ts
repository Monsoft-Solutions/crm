import { ResendEventType } from '../../twilio/enums';

export const resendEventTypeToStatus = (eventType: ResendEventType) => {
    switch (eventType) {
        case 'email.sent': {
            return 'sent';
        }

        case 'email.delivered': {
            return 'delivered';
        }
    }
};
