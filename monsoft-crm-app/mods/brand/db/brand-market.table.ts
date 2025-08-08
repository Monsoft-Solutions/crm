import { relations } from 'drizzle-orm';

import { table, text } from '@db/sql';

export const brandMarket = table('brand_market', {
    id: text('id').primaryKey(),

    // Brief descriptions of main product/service offerings
    keyProducts: text('key_products'),

    // Unique selling propositions and competitive advantages
    differentiators: text('differentiators'),

    // Customer problems and challenges the brand addresses
    painPoints: text('pain_points'),

    // Description of primary customer segments and personas
    targetSegments: text('target_segments'),
});

export const brandMarketRelations = relations(
    brandMarket,

    () => ({}),
);
