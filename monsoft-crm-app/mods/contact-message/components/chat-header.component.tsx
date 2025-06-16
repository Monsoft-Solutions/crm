import { ChevronLeft, Menu } from 'lucide-react';

import { Button } from '@ui/button.ui';

import { ContactAvatar } from '@mods/contact/components';

import { api } from '@api/providers/web';

type ChatHeaderProps = {
    activeContactId: string;
    isMobileView?: boolean;
    onBackToList?: () => void;
};

export function ChatHeader({
    activeContactId,
    isMobileView = false,
    onBackToList,
}: ChatHeaderProps) {
    const {
        data: activeContact,
        error: activeContactError,
        isLoading: isLoadingActiveContact,
    } = api.contactMessage.getContactSummary.useQuery({
        contactId: activeContactId,
    });

    if (isLoadingActiveContact) return;
    if (activeContactError) return;

    const contactSummary = activeContact;

    const { contact } = contactSummary;

    return (
        <div className="flex h-16 items-center justify-between border-b bg-white px-3 shadow-sm sm:px-5">
            <div className="flex grow items-center">
                {/* Back button for mobile view */}
                {isMobileView && onBackToList && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="mr-2 size-8 rounded-full p-0 hover:bg-gray-100"
                        onClick={(e) => {
                            e.preventDefault();
                            // Call the back function to clear the URL and return to contacts list
                            onBackToList();
                        }}
                        aria-label="Back to contacts"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                )}

                {/* Menu button on mobile only */}
                {isMobileView && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="mr-2 size-8 rounded-full p-0 hover:bg-gray-100 sm:hidden"
                        // onClick={() => {
                        //     setNavbarOpen(!navbarOpen);
                        // }}
                        aria-label="Menu"
                    >
                        <Menu className="h-4 w-4" />
                    </Button>
                )}

                <div className="relative">
                    <ContactAvatar
                        id={activeContactId}
                        firstName={contact.firstName}
                        lastName={contact.lastName}
                    />
                    <span className="absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full border border-white bg-green-500"></span>
                </div>

                <div className="ml-3 grow overflow-hidden">
                    <div className="flex flex-col">
                        <p className="truncate text-sm font-medium">
                            {contact.firstName} {contact.lastName}
                        </p>
                        <p className="text-xs text-gray-500">Online</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
