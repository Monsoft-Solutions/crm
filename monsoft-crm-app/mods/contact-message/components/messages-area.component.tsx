import { Card } from '@shared/ui/card.ui';
import { ScrollArea } from '@ui/scroll-area.ui';

import { MessageBubble } from './message-bubble.component';

import { api, apiClientUtils } from '@api/providers/web';

function formatMessageDate(date: Date) {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
        return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
    }
    return date.toLocaleDateString();
}

export function MessagesArea({ contactId }: { contactId: string }) {
    const {
        data: messages,
        error: messagesError,
        isLoading: isLoadingMessages,
    } = api.contactMessage.getContactMessages.useQuery({
        contactId,
    });

    const {
        getContactMessages: { setData: setContactMessages },
    } = apiClientUtils.contactMessage;

    const lastMessage = messages?.at(-1);

    const { data: lastMessageReplySuggestions } =
        api.assistant.getReplySuggestions.useQuery(
            {
                messageId: lastMessage ? lastMessage.id : '',
            },
            {
                enabled: !!lastMessage,
            },
        );

    api.assistant.onReplySuggestionsCreated.useSubscription(
        {
            messageId: lastMessage ? lastMessage.id : '',
        },

        {
            onData: ({ messageId }) => {
                void apiClientUtils.assistant.getReplySuggestions.invalidate({
                    messageId,
                });
            },
        },
    );

    api.contactMessage.onNewContactMessage.useSubscription(
        {
            contactId,
        },

        {
            onData: (data) => {
                setContactMessages({ contactId }, (prevData) =>
                    !prevData || prevData.error
                        ? prevData
                        : {
                              ...prevData,
                              data: [
                                  ...prevData.data,
                                  { ...data, status: 'queued' },
                              ],
                          },
                );
            },
        },
    );

    api.contactMessage.onContactMessageStatusUpdated.useSubscription(
        {
            contactId,
        },

        {
            onData: ({ id, status }) => {
                setContactMessages({ contactId }, (prevData) =>
                    !prevData || prevData.error
                        ? prevData
                        : {
                              ...prevData,
                              data: prevData.data.map((message) =>
                                  message.id === id
                                      ? { ...message, status }
                                      : message,
                              ),
                          },
                );
            },
        },
    );

    const selectReplySuggestion = (id: string, content: string) => {
        void api.assistant.selectReplySuggestion.mutate({ id });

        window.dispatchEvent(
            new CustomEvent('setNewMessage', { detail: content }),
        );
    };

    if (isLoadingMessages) return;
    if (messagesError) return;

    const messagesByDate = messages.reduce<Record<string, typeof messages>>(
        (groups, message) => {
            const date = new Date(message.createdAt);
            const dateString = date.toDateString();

            return {
                ...groups,
                [dateString]: [...(groups[dateString] ?? []), message],
            };
        },
        {},
    );

    return (
        <div className="relative grow">
            <div className="absolute inset-0">
                <ScrollArea className="h-full px-5 py-1">
                    <div className="flex flex-col gap-3 py-6">
                        {Object.entries(messagesByDate).map(
                            ([dateString, dateMessages]) => (
                                <div
                                    key={dateString}
                                    className="flex flex-col gap-3"
                                >
                                    <div className="my-3 flex justify-center">
                                        <div className="bg-muted text-muted-foreground rounded-full px-3 py-0.5 text-[10px] font-medium shadow-sm backdrop-blur-sm">
                                            {formatMessageDate(
                                                new Date(dateString),
                                            )}
                                        </div>
                                    </div>

                                    {dateMessages.map((message) => (
                                        <MessageBubble
                                            key={message.id}
                                            id={message.id}
                                            channelType={message.channelType}
                                            direction={message.direction}
                                            body={message.body}
                                            createdAt={message.createdAt}
                                            status={message.status}
                                        />
                                    ))}
                                </div>
                            ),
                        )}
                    </div>

                    <div className="flex justify-between gap-4">
                        {lastMessageReplySuggestions?.map(({ id, content }) => (
                            <Card
                                key={id}
                                className="bg-primary/[0.06] border-primary/10 hover:bg-primary/[0.1] flex-1 cursor-pointer border p-2 transition-colors"
                                onClick={() => {
                                    selectReplySuggestion(id, content);
                                }}
                            >
                                {content}
                            </Card>
                        ))}
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
}
