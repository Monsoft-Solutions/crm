import { table, text } from '@db/sql';

import { contact } from '@db/db';

export const contactEmailAddress = table('contact_email_address', {
    id: text('id').primaryKey(),

    contactId: text('contact_id')
        .notNull()
        .references(() => contact.id),

    emailAddress: text('email_address').notNull(),
});
