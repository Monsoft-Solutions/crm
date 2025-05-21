import { createLazyFileRoute } from '@tanstack/react-router';

import { TemplatesMonitorView } from '@mods/template/views/public';

// templates-monitoring view
export const Route = createLazyFileRoute('/_public/templates/monitor')({
    component: TemplatesMonitorView,
});
