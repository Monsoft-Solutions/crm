import { throwAsync } from '@errors/utils';

import { emit, listen } from '@events/providers';

import { getTemplatesStats } from '../providers/server';

// template-status-updated listener
void listen('templateStatusUpdated', async () => {
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
