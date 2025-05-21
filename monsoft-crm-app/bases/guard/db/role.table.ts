import { relations } from 'drizzle-orm';
import { char, enumType, sqlEnum, table, text } from '@db/sql';

import { roles } from '@guard/constants';

import { userRoleTable } from './user-role.table';

export const roleEnum = enumType('name', roles);

// active roles that a user can perform
export const roleTable = table('roles', {
    id: char('id', { length: 36 }).primaryKey(),
    name: sqlEnum('name', roleEnum).notNull().unique(),
    description: text('description'),
});

export const roleTableRelations = relations(roleTable, ({ many }) => ({
    users: many(userRoleTable),
}));
