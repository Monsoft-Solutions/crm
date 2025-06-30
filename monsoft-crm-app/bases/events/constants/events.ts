// all defined events

import * as twilioEvents from '@twilio/events';
import * as metaEvents from '@meta/events';
import * as emailEvents from '@email/events';

import * as appEvents from '@app/events';

export const events = {
    ...twilioEvents,
    ...metaEvents,
    ...emailEvents,
    ...appEvents,
};
