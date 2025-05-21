import { eq } from 'drizzle-orm';
import { db } from '@db/providers/server/db-client.provider';

import { organization } from '../db';

import { testOrganization } from './constants';

// organization seeds
export const organizationSeed = async () => {
    console.log('seeding test organization...');

    const existingTestOrganization = await db.query.organization.findFirst({
        where: eq(organization.id, testOrganization.id),
    });

    if (existingTestOrganization) {
        console.log('test organization already exists');
        return;
    }

    await db.insert(organization).values(testOrganization);

    console.log('test organization seeded');
};
