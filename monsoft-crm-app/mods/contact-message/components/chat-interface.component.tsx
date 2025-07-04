import { useMeasure } from 'react-use';

import { Card } from '@ui/card.ui';

import { ContactsList } from './contacts-list.component';
import { ChatHeader } from './chat-header.component';
import { MessagesArea } from './messages-area.component';

import { MessageInput } from './message-input.component';

export function ChatInterface({
    brandId,
    activeContactId,
    setActiveContactId,
}: {
    brandId: string;
    activeContactId?: string;
    setActiveContactId: (id: string) => void;
}) {
    const [ref, { width }] = useMeasure<HTMLDivElement>();

    const isMobileView = width <= 800;

    return (
        <Card ref={ref} className="flex h-full w-full overflow-hidden p-0">
            {/* Show contacts list on desktop (width > 800) or when no active contact on mobile */}
            {(!isMobileView || !activeContactId) && (
                <ContactsList
                    brandId={brandId}
                    activeContactId={activeContactId}
                    setActiveContactId={setActiveContactId}
                    isMobileView={isMobileView}
                />
            )}

            {/* Show messages area when there's an active contact */}
            {activeContactId !== undefined && (
                <div className="flex flex-1 flex-col">
                    <ChatHeader
                        activeContactId={activeContactId}
                        isMobileView={isMobileView}
                        onBackToList={() => {
                            // Clear the contact ID from URL and show the contacts list
                            setActiveContactId('');
                        }}
                    />

                    <MessagesArea contactId={activeContactId} />

                    <MessageInput activeContactId={activeContactId} />
                </div>
            )}
        </Card>
    );
}
