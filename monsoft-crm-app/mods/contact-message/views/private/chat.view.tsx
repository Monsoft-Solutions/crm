import { useCallback } from 'react';

import { ChatInterface } from '@mods/contact-message/components';

import { Route } from '@routes/_private/brand/$brandId/chat';

export function ChatView() {
    const navigate = Route.useNavigate();

    const { id: activeContactId } = Route.useSearch();

    console.log('-->   ~ ChatView ~ activeContactId:', activeContactId);
    const setActiveContactId = useCallback(
        (id: string) => {
            // If id is empty string, we're clearing the contact selection (going back to list)
            if (id === '') {
                void navigate({
                    search: {}, // Clear all search params including id
                    replace: true, // Replace current URL to avoid creating extra history entries
                });
            } else {
                void navigate({
                    search: { id },
                });
            }
        },
        [navigate],
    );

    return (
        <div className="container absolute inset-0 p-0 py-2 sm:py-4 md:py-10">
            <ChatInterface
                activeContactId={activeContactId}
                setActiveContactId={setActiveContactId}
            />
        </div>
    );
}
