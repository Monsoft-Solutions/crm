import { table, text } from '@db/sql';

import { contactTable } from '@db/db.tables';

export const contactEmailAddressTable = table('contact_email_address', {
    id: text('id').primaryKey(),

    contactId: text('contact_id')
        .notNull()
        .references(() => contactTable.id),

    emailAddress: text('email_address').notNull(),
});
