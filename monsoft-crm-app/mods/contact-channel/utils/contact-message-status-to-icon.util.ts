import { ContactMessageStatus } from '@mods/contact-message/enums';

import { Check, CheckCheck, ClockArrowUp } from 'lucide-react';

// Map channel types to their respective icons
export const contactMessageStatusToIcon = (status: ContactMessageStatus) => {
    switch (status) {
        case 'queued':
            return ClockArrowUp;
        case 'sent':
            return Check;
        case 'delivered':
            return CheckCheck;
        case 'read':
            return CheckCheck;
    }
};
