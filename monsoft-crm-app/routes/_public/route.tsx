import { createFileRoute } from '@tanstack/react-router';

// public routes
export const Route = createFileRoute('/_public')({
    beforeLoad: async ({
        context: {
            auth: { getLoggedInUser },
        },
    }) => {
        // get logged-in user
        // or null if not logged-in
        const { data: loggedInUser } = await getLoggedInUser();

        // add logged-in user (possibly null) to router context
        return { loggedInUser };
    },
});
