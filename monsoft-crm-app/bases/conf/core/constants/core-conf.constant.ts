import { Conf } from '../../types';

import * as appCore from '@app/conf/core';
import * as emailCore from '../../../email/conf/core';
import * as twilioCore from '../../../twilio/conf/core';
import * as aiCore from '../../../ai/conf/core';

const modulesCoreConf = {
    ...appCore,
    ...emailCore,
    ...twilioCore,
    ...aiCore,
};

// full app core configuration
export const coreConf = Object.entries(modulesCoreConf).reduce(
    (acc, [, moduleConf]) => ({
        ...acc,
        ...moduleConf,
    }),
    {},
) as Conf<typeof modulesCoreConf>;
