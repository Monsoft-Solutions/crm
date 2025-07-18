import { createFileRoute } from '@tanstack/react-router';

import { AssistantManagementDashboardView } from '@mods/assistant/views';

export const Route = createFileRoute('/_private/assistant/')({
    component: AssistantManagementDashboardView,
});
