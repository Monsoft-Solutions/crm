import { throwAsync } from '@errors/utils';

import { emit, listen } from '@events/providers';

import { getTemplatesStats } from '../providers/server';

import { db as dbProvider } from '@db/providers/server';

// template-status-updated listener
void listen('templateStatusUpdated', async () => {
    // get the templates stats
    await dbProvider.transaction(async (db) => {
        const { data: templatesStats, error: templateStatsError } =
            await getTemplatesStats({ db });

        if (templateStatsError) {
            throwAsync('TEMPLATE_CREATED_LISTENER');

            return;
        }

        // emit a template-stats-changed event with the updated values
        emit({ event: 'templateStatsChanged', payload: templatesStats });
    });
});
