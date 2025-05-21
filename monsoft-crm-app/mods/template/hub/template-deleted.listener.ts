import { throwAsync } from '@errors/utils';

import { emit } from '@events/providers';
import { listen } from '@events/providers/listen.provider';

import { getTemplatesStats } from '../providers/server';

// template-deleted listener
void listen('templateDeleted', async () => {
    // get the templates stats
    const { data: templatesStats, error: templateStatsError } =
        await getTemplatesStats();

    if (templateStatsError) {
        throwAsync('TEMPLATE_CREATED_LISTENER');

        return;
    }

    // emit a template-stats-changed event with the updated values
    emit({ event: 'templateStatsChanged', payload: templatesStats });
});
