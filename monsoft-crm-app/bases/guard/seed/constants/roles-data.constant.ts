import { InferInsertModel } from 'drizzle-orm';

import { roleTable } from '@db/db';

export const rolesData: InferInsertModel<typeof roleTable>[] = [];
