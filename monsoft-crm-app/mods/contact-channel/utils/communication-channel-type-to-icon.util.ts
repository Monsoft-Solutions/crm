import { ContactChannelType } from '../enums';

import {
    Mail,
    MessageCircle,
    MessageSquare,
    MessagesSquare,
    Camera,
} from 'lucide-react';

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
        case 'messenger':
            return MessagesSquare;
        case 'instagram':
            return Camera;
    }
};
