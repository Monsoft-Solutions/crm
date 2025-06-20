// all defined events

import * as smsEvents from '@twilio/events';
import * as emailEvents from '@email/events';

import * as appEvents from '@app/events';

export const events = {
    ...smsEvents,
    ...emailEvents,
    ...appEvents,
};
