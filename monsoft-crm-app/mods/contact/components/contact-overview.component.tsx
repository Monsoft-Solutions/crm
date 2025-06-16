import { ContactAvatar } from './contact-avatar.component';

import { api } from '@api/providers/web';

export function ContactOverview({ contactId }: { contactId: string }) {
    const { data: contactBasicInfo } = api.contact.getContact.useQuery({
        id: contactId,
    });

    return (
        <div className="min-h-40">
            {contactBasicInfo && (
                <>
                    <ContactAvatar
                        id={contactId}
                        firstName={contactBasicInfo.firstName}
                        lastName={contactBasicInfo.lastName}
                        className="mx-auto size-20"
                    />

                    <h2 className="mt-2 mb-6 text-center text-xl font-bold">
                        {contactBasicInfo.firstName} {contactBasicInfo.lastName}
                    </h2>
                </>
            )}
        </div>
    );
}
