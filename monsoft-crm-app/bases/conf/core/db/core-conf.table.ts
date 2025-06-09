import { char, table } from '@db/sql';

import { coreConf } from '../constants';

// Core configuration table
export const coreConfTable = table('core_conf', {
    id: char('id', { length: 36 }).primaryKey(),

    ...coreConf,
});
