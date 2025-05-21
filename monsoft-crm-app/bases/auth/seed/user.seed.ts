import { eq } from 'drizzle-orm';
import { db } from '@db/providers/server/db-client.provider';

import { user } from '../db';

import { testUser } from './constants';

// user seeds
export const userSeed = async () => {
    console.log('seeding test user...');

    const existingTestUser = await db.query.user.findFirst({
        where: eq(user.id, testUser.id),
    });

    if (existingTestUser) {
        console.log('test user already exists');
        return;
    }

    await db.insert(user).values(testUser);

    console.log('test user seeded');
};
