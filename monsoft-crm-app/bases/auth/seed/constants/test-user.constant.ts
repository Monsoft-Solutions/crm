import { InferInsertModel } from 'drizzle-orm';

import { user } from '@db/db';

export const testUser: InferInsertModel<typeof user> = {
    id: 'test-user-id',
    name: 'Test',
    lastName: 'User',
    email: 'test@email.com',
    emailVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
};
