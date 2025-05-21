import { createFileRoute, Navigate } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
    component: () => (
        // automatically navigate the main view
        <Navigate to="/template" />
    ),
});
