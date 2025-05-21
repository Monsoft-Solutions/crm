import { createFileRoute, Navigate } from '@tanstack/react-router';

export const Route = createFileRoute('/_private/template/')({
    // just redirect to main template view (template-management)
    component: () => <Navigate to="/template/manage" />,
});
