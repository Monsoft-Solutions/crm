import { useCallback, useState } from 'react';

import { useNavigate } from '@tanstack/react-router';

import { cn } from '@css/utils';

import { ChevronLeft, ChevronRight, PlusIcon } from 'lucide-react';

import { Button } from '@ui/button.ui';
import { ScrollArea } from '@ui/scroll-area.ui';

import { ContactCard } from './contact-card.component';

import { CreateContactDialog } from '@mods/contact/components/create-contact-dialog.component';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectSeparator,
} from '@shared/ui/select.ui';

import { api, apiClientUtils } from '@api/providers/web';
import { CreateBrandForm } from '@mods/brand/components/create-brand-form.component';
import { Dialog, DialogContent, DialogTrigger } from '@shared/ui/dialog.ui';

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

    const [isCreateBrandDialogOpen, setIsCreateBrandDialogOpen] =
        useState(false);

    const [availablePhoneNumbers, setAvailablePhoneNumbers] = useState<
        string[]
    >([]);

    const [isSelectBrandOpen, setIsSelectBrandOpen] = useState(false);

    const handleCreateBrandDialogOpenChange = async (open: boolean) => {
        if (open) {
            const result =
                await apiClientUtils.brand.getAvailablePhoneNumbers.ensureData();

            if (result.error) return;

            setAvailablePhoneNumbers(result.data);

            setIsSelectBrandOpen(false);
        }

        setIsCreateBrandDialogOpen(open);
    };

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

    api.contact.onNewContact.useSubscription(
        {
            brandId,
        },

        {
            async onData() {
                await apiClientUtils.contact.getContactsIds.invalidate({
                    brandId,
                });
            },
        },
    );

    if (isLoadingContacts) return;
    if (contactsError) return;

    if (isLoadingBrands) return;
    if (brandsError) return;

    return (
        <div
            className={cn(
                'border-border relative z-0 flex flex-col border-r transition-all duration-300',
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
                        'bg-muted/80 sticky top-0 z-10 flex items-center gap-2 border-b px-4 py-3',
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
                                open={isSelectBrandOpen}
                                onOpenChange={setIsSelectBrandOpen}
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

                                    <SelectSeparator />

                                    <div className="flex flex-col gap-2">
                                        <Dialog
                                            open={isCreateBrandDialogOpen}
                                            onOpenChange={(open) =>
                                                void handleCreateBrandDialogOpenChange(
                                                    open,
                                                )
                                            }
                                        >
                                            <DialogTrigger
                                                className="justify-start"
                                                asChild
                                            >
                                                <Button
                                                    variant="ghost"
                                                    className="gap-2"
                                                >
                                                    <PlusIcon className="h-4 w-4" />
                                                    New Brand
                                                </Button>
                                            </DialogTrigger>

                                            <DialogContent>
                                                <CreateBrandForm
                                                    availablePhoneNumbers={
                                                        availablePhoneNumbers
                                                    }
                                                />
                                            </DialogContent>
                                        </Dialog>
                                    </div>
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
                            <div className="border-border/50 bg-muted/50 mx-3 my-4 flex h-60 flex-col items-center justify-center rounded-md border p-6 text-center">
                                <p className="text-foreground mb-1 font-medium">
                                    No contacts found
                                </p>

                                <p className="text-muted-foreground max-w-[220px] text-xs">
                                    Create a new contact to start chatting or
                                    try a different search term
                                </p>

                                <CreateContactDialog brandId={brandId}>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-primary/20 bg-primary/10 text-primary hover:bg-primary/15 mt-4 rounded-full"
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
                    className="bg-card absolute top-4.5 right-0 z-50 hidden size-6 translate-x-1/2 transform rounded-full border shadow-sm md:flex"
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
