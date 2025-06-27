import { Conf } from '@conf/types';

import * as twilioCustom from '../../../twilio/conf/custom';
import * as appCustom from '@app/conf/custom';

const modulesCustomConf = {
    ...appCustom,
    ...twilioCustom,
};

// full app custom configuration
export const customConf = Object.entries(modulesCustomConf).reduce(
    (acc, [, moduleConf]) => ({
        ...acc,
        ...moduleConf,
    }),
    {},
) as Conf<typeof modulesCustomConf>;
