import { Conf } from '../../types';

import * as emailCore from '../../../email/conf/core';
import * as twilioCore from '../../../twilio/conf/core';
import * as metaCore from '../../../meta/conf/core';
import * as aiCore from '../../../ai/conf/core';

import * as appCore from '@app/conf/core';

const modulesCoreConf = {
    ...emailCore,
    ...twilioCore,
    ...metaCore,
    ...aiCore,

    ...appCore,
};

// full app core configuration
export const coreConf = Object.entries(modulesCoreConf).reduce(
    (acc, [, moduleConf]) => ({
        ...acc,
        ...moduleConf,
    }),
    {},
) as Conf<typeof modulesCoreConf>;
