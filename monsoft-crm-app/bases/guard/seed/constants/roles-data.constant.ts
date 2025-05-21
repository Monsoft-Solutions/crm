import { InferInsertModel } from 'drizzle-orm';

import { roleTable } from '@db/db.tables';

export const rolesData: InferInsertModel<typeof roleTable>[] = [];
