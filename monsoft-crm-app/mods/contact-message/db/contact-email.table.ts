import { table, text } from '@db/sql';

import { contactEmailAddressTable } from '@db/db.tables';

export const contactEmailTable = table('contact_email', {
    id: text('id').primaryKey(),

    contactEmailAddressId: text('contact_email_address_id')
        .notNull()
        .references(() => contactEmailAddressTable.id),

    body: text('body').notNull(),
});
