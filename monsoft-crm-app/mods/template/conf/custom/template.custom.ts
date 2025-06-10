import { boolean } from '@db/sql';

// template custom configuration
export const templateCustomConf = {
    // wether the random template service is active
    randomTemplateServiceActive: boolean('random_template_service_active'),
};
