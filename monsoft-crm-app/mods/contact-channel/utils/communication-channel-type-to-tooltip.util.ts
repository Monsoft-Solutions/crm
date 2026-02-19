import { ContactChannelType } from '../enums';

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
        case 'messenger':
            return 'Messenger';
        case 'instagram':
            return 'Instagram';
    }
};
