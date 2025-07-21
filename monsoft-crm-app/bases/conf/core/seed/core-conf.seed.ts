import { eq } from 'drizzle-orm';
import { db } from '@db/providers/server/db-client.provider';

import { coreConfTable } from '../db';

import { coreConfigData } from './constants';

// Core configuration seeds
export const coreConfSeed = async () => {
    console.log('seeding core configuration...');

    const existingCoreConfig = await db.query.coreConfTable.findFirst({
        where: eq(coreConfTable.id, coreConfigData.id),
    });

    if (existingCoreConfig) {
        console.log('core configuration already exists');
        return;
    }

    await db.insert(coreConfTable).values(coreConfigData);

    console.log('core configuration seeded');
};
