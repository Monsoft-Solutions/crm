import { relations } from 'drizzle-orm';
import { table, text, int, enumType } from '@db/sql';

import tables from '@db/db';

import { industryEnum, companySizeEnum } from '../enums';

export const industry = enumType('brand_industry', industryEnum.options);

export const companySize = enumType(
    'brand_company_size',
    companySizeEnum.options,
);

export const brand = table('brand', {
    id: text('id').primaryKey(),

    organizationId: text('organization_id')
        .notNull()
        .references(() => tables.organization.id, { onDelete: 'cascade' }),

    // Brand name
    name: text('name').notNull(),

    // Brief description of what the company does and its mission
    description: text('description').notNull(),

    // Industry sector the brand operates in
    industry: industry('industry').notNull(),

    // Company size classification
    companySize: companySize('company_size').notNull(),

    // Year the company was founded
    foundedYear: int('founded_year').notNull(),
});

export const brandRelations = relations(
    brand,

    ({ many }) => ({
        phoneNumbers: many(tables.brandPhoneNumber),

        whatsappNumbers: many(tables.brandWhatsappNumber),

        domains: many(tables.brandDomain),

        contacts: many(tables.contact),

        assistants: many(tables.assistant),
    }),
);
