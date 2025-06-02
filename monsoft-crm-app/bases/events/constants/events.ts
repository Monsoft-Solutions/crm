// all defined events

import * as smsEvents from '@sms/events';

import * as appEvents from '@app/events';

export const events = {
    ...smsEvents,
    ...appEvents,
};
