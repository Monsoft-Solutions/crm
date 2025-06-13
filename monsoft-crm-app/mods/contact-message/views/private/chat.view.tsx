import { useCallback } from 'react';

import { ChatInterface } from '@mods/contact-message/components';

import { Route } from '@routes/_private/chat/$brandId';

export function ChatView() {
    const navigate = Route.useNavigate();

    const { brandId } = Route.useParams();

    const { id: activeContactId } = Route.useSearch();

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
        <div className="absolute inset-0">
            <ChatInterface
                brandId={brandId}
                activeContactId={activeContactId}
                setActiveContactId={setActiveContactId}
            />
        </div>
    );
}
