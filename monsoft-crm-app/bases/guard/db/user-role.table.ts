import { relations } from 'drizzle-orm';
import { char, table } from '@db/sql';

import { roleTable } from './role.table';
import { user } from '../../auth/db';

// role assignments
export const userRoleTable = table('user_roles', {
    id: char('id', { length: 36 }).primaryKey(),
    userId: char('user_id', { length: 36 })
        .notNull()
        .references(() => user.id, { onDelete: 'cascade' }),
    roleId: char('role_id', { length: 36 })
        .notNull()
        .references(() => roleTable.id, { onDelete: 'cascade' }),
});

export const userRoleTableRelations = relations(userRoleTable, ({ one }) => ({
    // the user beign assigned the role
    user: one(user, {
        fields: [userRoleTable.userId],
        references: [user.id],
    }),

    // the role being assigned to the user
    role: one(roleTable, {
        fields: [userRoleTable.roleId],
        references: [roleTable.id],
    }),
}));
