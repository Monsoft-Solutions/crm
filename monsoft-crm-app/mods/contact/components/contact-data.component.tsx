import { User, MessageSquare } from 'lucide-react';

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@ui/accordion.ui';

import { ContactInfo } from './contact-info.component';
import { ContactPhoneNumbers } from './contact-phone-numbers.component';

export function ContactData({ contactId }: { contactId: string }) {
    return (
        <div className="flex flex-col">
            <Accordion
                type="single"
                defaultValue="contracts"
                collapsible
                className="border-none"
            >
                <AccordionItem value="info">
                    <AccordionTrigger className="py-3 transition-colors hover:bg-gray-50/80">
                        <div className="flex items-center">
                            <User className="text-primary/70 mr-2 h-5 w-5" />

                            <h3 className="text-base font-medium">
                                Personal Info
                            </h3>
                        </div>
                    </AccordionTrigger>

                    <AccordionContent className="px-3 pt-3 pb-5">
                        <ContactInfo key={contactId} contactId={contactId} />
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="sms">
                    <AccordionTrigger className="py-3 transition-colors hover:bg-gray-50/80">
                        <div className="flex items-center">
                            <MessageSquare className="text-primary/70 mr-2 h-5 w-5 scale-80" />

                            <h3 className="text-base font-medium">SMS</h3>
                        </div>
                    </AccordionTrigger>

                    <AccordionContent className="px-3 pt-3 pb-5">
                        <ContactPhoneNumbers
                            key={contactId}
                            contactId={contactId}
                        />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}
