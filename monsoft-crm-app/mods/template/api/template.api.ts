import { endpoints } from '@api/providers/server';

// queries
import { searchTemplates } from './search-templates.query';
import { getRandomTemplate } from './get-random-template.query';
import { getTemplatesStats } from './get-templates-stats.query';

// mutations
import { createTemplate } from './create-template.mutation';
import { updateTemplateStatus } from './update-template-status.mutation';
import { deleteTemplate } from './delete-template.mutation';
import { toggleRandomTemplateService } from './toggle-random-template-service.mutation';
import { getBpi } from './get-bpi.mutation';

// subscriptions
import { onTemplateCreated } from './template-created.subscription';
import { onTemplateStatusUpdated } from '@mods/template/api/template-status-updated.subscription';
import { onTemplateDeleted } from '@mods/template/api/template-deleted.subscription';
import { onTemplatesStatsChanged } from './templates-stats-changed.subscription';
import { getIsRandomServiceActive } from './get-is-random-service-active.query';

export const template = endpoints({
    // queries
    searchTemplates,
    getRandomTemplate,
    getTemplatesStats,
    getIsRandomServiceActive,

    // mutations
    createTemplate,
    updateTemplateStatus,
    deleteTemplate,
    toggleRandomTemplateService,
    getBpi,

    // subscriptions
    onTemplateCreated,
    onTemplateStatusUpdated,
    onTemplateDeleted,
    onTemplatesStatsChanged,
});
