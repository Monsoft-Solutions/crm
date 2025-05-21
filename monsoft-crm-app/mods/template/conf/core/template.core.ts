import { boolean } from '@db/sql';

// template core configuration
export const templateCoreConf = {
    // wether the random template service is deterministic or actually random
    randomTemplateDeterministic: boolean(
        'random_template_deterministic',
    ).notNull(),
};
