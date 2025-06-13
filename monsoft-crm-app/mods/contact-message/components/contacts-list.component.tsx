import { useCallback, useState } from 'react';

import { useNavigate } from '@tanstack/react-router';

import { cn } from '@css/utils';

import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@ui/button.ui';
import { ScrollArea } from '@ui/scroll-area.ui';

import { ContactCard } from './contact-card.component';

import { api } from '@api/providers/web';
import { CreateContactDialog } from '@mods/contact/components/create-contact-dialog.component';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@shared/ui/select.ui';

export function ContactsList({
    brandId,
    activeContactId,
    setActiveContactId,
    isMobileView = false,
}: {
    brandId: string;
    activeContactId?: string;
    setActiveContactId: (id: string) => void;
    isMobileView?: boolean;
}) {
    const navigate = useNavigate();

    const [isContactsExpanded, setIsContactsExpanded] = useState(true);

    const {
        data: brands,
        error: brandsError,
        isLoading: isLoadingBrands,
    } = api.brand.getBrands.useQuery();

    const setActiveBrandId = useCallback(
        async (brandId: string) => {
            await navigate({
                to: '/chat/$brandId',
                params: { brandId },
            });
        },
        [navigate],
    );

    const handleContactSelect = useCallback(
        (contactId: string) => {
            setActiveContactId(contactId);
        },
        [setActiveContactId],
    );

    const toggleContacts = () => {
        setIsContactsExpanded((state) => !state);
    };

    const {
        data: contacts,
        error: contactsError,
        isLoading: isLoadingContacts,
    } = api.contact.getContactsIds.useQuery({
        brandId,
    });

    if (isLoadingContacts) return;
    if (contactsError) return;

    if (isLoadingBrands) return;
    if (brandsError) return;

    return (
        <div
            className={cn(
                'relative z-0 flex flex-col border-r border-gray-200 transition-all duration-300',
                isMobileView
                    ? 'w-full' // Take full width on mobile
                    : isContactsExpanded
                      ? 'w-72'
                      : 'w-[60px]',
            )}
        >
            <div className="relative flex h-full flex-col">
                {/* Header with fixed height similar to WhatsApp */}
                <div
                    className={cn(
                        'sticky top-0 z-10 flex items-center gap-2 border-b bg-gray-100/80 px-4 py-3',
                        isMobileView
                            ? 'justify-between' // Mobile header always expanded
                            : isContactsExpanded
                              ? 'justify-between'
                              : 'justify-center',
                    )}
                >
                    {/* App title or user profile section */}
                    <div className="flex grow items-center">
                        <h2
                            className={cn(
                                'w-full text-lg font-semibold',
                                !isContactsExpanded &&
                                    !isMobileView &&
                                    'hidden',
                            )}
                        >
                            <Select
                                value={brandId}
                                onValueChange={(value) => {
                                    void setActiveBrandId(value);
                                }}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a brand" />
                                </SelectTrigger>

                                <SelectContent>
                                    {brands.map((brand) => (
                                        <SelectItem
                                            key={brand.id}
                                            value={brand.id}
                                        >
                                            {brand.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </h2>
                    </div>

                    {/* Actions section */}
                    <div className="flex items-center gap-2">
                        {/* New chat button (like WhatsApp) */}
                        <CreateContactDialog brandId={brandId} />
                    </div>
                </div>

                {/* Contact list with improved scrolling */}
                <ScrollArea
                    className="flex-1 overflow-y-auto"
                    showThumb={false}
                    viewportClassName="block"
                >
                    <div className={cn('flex flex-col', isContactsExpanded)}>
                        {contacts.length === 0 && isContactsExpanded ? (
                            <div className="mx-3 my-4 flex h-60 flex-col items-center justify-center rounded-md border border-gray-100 bg-gray-50 p-6 text-center">
                                <p className="mb-1 font-medium text-gray-700">
                                    No contacts found
                                </p>

                                <p className="max-w-[220px] text-xs text-gray-500">
                                    Create a new contact to start chatting or
                                    try a different search term
                                </p>

                                <CreateContactDialog brandId={brandId}>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="mt-4 rounded-full border-blue-100 bg-blue-50 text-blue-600 hover:bg-blue-100"
                                    >
                                        Create New Contact
                                    </Button>
                                </CreateContactDialog>
                            </div>
                        ) : (
                            contacts.map((contact) => (
                                <ContactCard
                                    key={contact.id}
                                    contactId={contact.id}
                                    expanded={
                                        isMobileView || isContactsExpanded
                                    }
                                    active={activeContactId === contact.id}
                                    onSelect={() => {
                                        handleContactSelect(contact.id);
                                    }}
                                    isMobileView={isMobileView}
                                />
                            ))
                        )}
                    </div>
                </ScrollArea>
            </div>

            {/* Only show expand/collapse button on desktop (non-mobile) */}
            {!isMobileView && (
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleContacts}
                    className="absolute top-4.5 right-0 z-50 hidden size-6 translate-x-1/2 transform rounded-full border bg-white shadow-sm md:flex"
                    aria-label={
                        isContactsExpanded
                            ? 'Collapse contacts'
                            : 'Expand contacts'
                    }
                >
                    {isContactsExpanded ? (
                        <ChevronLeft className="h-4 w-4" />
                    ) : (
                        <ChevronRight className="h-4 w-4" />
                    )}
                </Button>
            )}
        </div>
    );
}
