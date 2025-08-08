import { AssistantManagementDashboard } from '../components';

export function AssistantManagementDashboardView() {
    return (
        <div className="container mx-auto p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Assistant Management</h1>

                <p className="text-muted-foreground">
                    Manage your brand assistants - configure their names,
                    models, tones, instructions, etc.
                </p>
            </div>

            <AssistantManagementDashboard />
        </div>
    );
}
