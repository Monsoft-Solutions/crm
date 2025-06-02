import { ContactChannelType } from '../enums';

import {
    Mail,
    MessageCircle,
    MessageSquare,
    MessagesSquare,
    Share2,
} from 'lucide-react';

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
            return MessagesSquare;
        case 'slack':
            return MessageCircle;
        case 'instagram':
            return Share2;
    }
};
