import { createFileRoute } from '@tanstack/react-router';

import { SettingsView } from '@mods/settings/views/settings.view';

export const Route = createFileRoute('/_private/settings/')({
    component: SettingsView,
});
