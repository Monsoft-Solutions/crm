import { Tabs, TabsContent, TabsList, TabsTrigger } from '@ui/tabs.ui';

import { ContactData } from './contact-data.component';
import { ContactOverview } from './contact-overview.component';
import { ConversationInsights } from './conversation-insights.component';

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarHeader,
    useSidebar,
} from '@shared/ui/sidebar.ui';

import { Button } from '@ui/button.ui';
import { ScrollArea } from '@ui/scroll-area.ui';
import { X, ChevronLeft } from 'lucide-react';

export function ContactInfoSidebar({ contactId }: { contactId: string }) {
    const { setOpenMobile, setOpen, isMobile } = useSidebar();

    return (
        <Sidebar variant="floating" collapsible="offcanvas" side="right">
            <SidebarHeader className="bg-card sticky top-0 z-10 flex items-center justify-between border-b px-4 py-3">
                <div className="flex items-center">
                    {isMobile && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="mr-2 h-9 w-9 rounded-md p-0"
                            onClick={() => {
                                setOpenMobile(false);
                            }}
                        >
                            <ChevronLeft className="h-5 w-5" />
                            <span className="sr-only">Back</span>
                        </Button>
                    )}
                    <h2 className="text-base font-medium">Contact Details</h2>
                </div>

                <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 w-9 rounded-md p-0"
                    onClick={() => {
                        setOpen(false);
                    }}
                >
                    <X className="h-5 w-5" />
                    <span className="sr-only">Close</span>
                </Button>
            </SidebarHeader>

            <SidebarContent className="flex h-[calc(100vh-3.5rem)] flex-col overflow-hidden">
                <ScrollArea className="h-full" viewportClassName="h-full">
                    <div className="border-b px-4 py-4">
                        <SidebarGroup
                            className="mb-2 flex flex-col"
                            key={contactId}
                        >
                            <ContactOverview contactId={contactId} />
                        </SidebarGroup>
                    </div>

                    <Tabs
                        defaultValue="contact"
                        className="flex w-full flex-col text-left"
                    >
                        <div className="bg-card sticky top-0 z-10">
                            <TabsList className="grid w-full grid-cols-2 bg-transparent p-0">
                                <TabsTrigger
                                    value="contact"
                                    className="data-[state=active]:text-primary data-[state=active]:after:bg-primary rounded-none border-0 py-3 after:absolute after:right-0 after:bottom-0 after:left-0 after:h-0.5 after:bg-transparent after:content-[''] data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                                >
                                    Contact Details
                                </TabsTrigger>

                                <TabsTrigger
                                    value="AI"
                                    className="data-[state=active]:text-primary data-[state=active]:after:bg-primary rounded-none border-0 py-3 after:absolute after:right-0 after:bottom-0 after:left-0 after:h-0.5 after:bg-transparent after:content-[''] data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                                >
                                    AI Insights
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        <div className="p-0">
                            <TabsContent
                                value="contact"
                                className="m-0 border-0 p-0"
                            >
                                <div className="p-4">
                                    <ContactData contactId={contactId} />
                                </div>
                            </TabsContent>

                            <TabsContent
                                value="AI"
                                className="m-0 border-0 p-0"
                            >
                                <div className="p-4">
                                    <ConversationInsights
                                        contactId={contactId}
                                    />
                                </div>
                            </TabsContent>
                        </div>
                    </Tabs>
                </ScrollArea>
            </SidebarContent>
        </Sidebar>
    );
}
