import { ContactMessageStatus } from '@mods/contact-message/enums';

import {
    Check,
    CheckCheck,
    CircleAlert,
    ClockArrowUp,
    Loader,
} from 'lucide-react';

// Map channel types to their respective icons
export const contactMessageStatusToIcon = (status: ContactMessageStatus) => {
    switch (status) {
        case 'accepted':
        case 'queued':
            return ClockArrowUp;
        case 'sending':
            return Loader;
        case 'sent':
            return Check;
        case 'delivered':
            return CheckCheck;
        case 'read':
            return CheckCheck;
        case 'undelivered':
        case 'failed':
            return CircleAlert;
    }
};
