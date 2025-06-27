import { Conf } from '@conf/types';

import * as appCustom from '@app/conf/custom';

const modulesCustomConf = {
    ...appCustom,
};

// full app custom configuration
export const customConf = Object.entries(modulesCustomConf).reduce(
    (acc, [, moduleConf]) => ({
        ...acc,
        ...moduleConf,
    }),
    {},
) as Conf<typeof modulesCustomConf>;
