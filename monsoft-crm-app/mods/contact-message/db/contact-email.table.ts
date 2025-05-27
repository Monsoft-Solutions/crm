import { table, text } from '@db/sql';

import { contactEmailAddress } from '@db/db';

export const contactEmailTable = table('contact_email', {
    id: text('id').primaryKey(),

    contactEmailAddressId: text('contact_email_address_id')
        .notNull()
        .references(() => contactEmailAddress.id),

    body: text('body').notNull(),
});
