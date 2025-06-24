import { ContactChannelType } from '../enums';

import { Mail, MessageCircle, MessageSquare } from 'lucide-react';

// Map channel types to their respective icons
export const communicationChannelTypeToIcon = (
    channelType: ContactChannelType,
) => {
    switch (channelType) {
        case 'sms':
            return MessageSquare;
        case 'email':
            return Mail;
        case 'whatsapp':
            return MessageCircle;
    }
};
