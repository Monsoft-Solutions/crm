import { ContactChannelType } from '../enums';

// Map channel types to their respective icons
export const communicationChannelTypeToTooltip = (
    channelType: ContactChannelType,
) => {
    switch (channelType) {
        case 'sms':
            return 'SMS';
        case 'email':
            return 'Email';
        case 'whatsapp':
            return 'WhatsApp';
    }
};
