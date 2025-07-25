import { organization } from '@db/db';

import { InferInsertModel } from 'drizzle-orm';

export const testOrganization: InferInsertModel<typeof organization> = {
    id: 'test-organization-id',
    name: 'Test Organization',
    createdAt: new Date(),
};
