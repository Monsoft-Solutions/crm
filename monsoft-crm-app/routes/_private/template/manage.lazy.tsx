import { createLazyFileRoute } from '@tanstack/react-router';

import { TemplateManagementView } from '@mods/template/views/private';

// template-management view
export const Route = createLazyFileRoute('/_private/template/manage')({
    component: TemplateManagementView,
});
