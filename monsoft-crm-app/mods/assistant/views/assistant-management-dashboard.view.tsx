import { PageHeader } from '@shared/components/page-header.component';

import { AssistantManagementDashboard } from '../components';

export function AssistantManagementDashboardView() {
    return (
        <div className="grow overflow-y-auto p-6">
            <PageHeader
                title="Assistant Management"
                description="Manage your brand assistants - configure their names, models, tones, instructions, etc."
            />

            <AssistantManagementDashboard />
        </div>
    );
}
