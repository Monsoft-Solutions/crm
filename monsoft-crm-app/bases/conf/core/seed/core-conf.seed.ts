import { db } from '@db/providers/server/db-client.provider';

import { coreConfTable } from '../db';

import { coreConfigData } from './constants';

// Core configuration seeds
export const coreConfSeed = async () => {
    await db.insert(coreConfTable).values(coreConfigData);
};
