import { createFileRoute, Navigate } from '@tanstack/react-router';

export const Route = createFileRoute('/_public/templates/')({
    // just redirect to main templates (public) view (templates-monitoring)
    component: () => <Navigate to="/templates/monitor" />,
});
