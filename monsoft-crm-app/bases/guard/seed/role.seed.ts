import { eq } from 'drizzle-orm';
import { db } from '@db/providers/server/db-client.provider';

import { roleTable } from '../db';

import { rolesData } from './constants';

// role seeds
export const roleSeed = async () => {
    console.log('seeding roles...');

    for (const role of rolesData) {
        const roleExists = await db.query.roleTable.findFirst({
            where: eq(roleTable.name, role.name),
        });

        if (roleExists) {
            console.log(`role ${role.name} already exists`);
            continue;
        }

        await db.insert(roleTable).values(role);
    }

    console.log(`roles seeded`);
};
