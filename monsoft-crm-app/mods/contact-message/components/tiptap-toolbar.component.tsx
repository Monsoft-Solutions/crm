import type { ReactElement } from 'react';
import type { Editor } from '@tiptap/react';

import { Bold, Italic, Link, List, ListOrdered } from 'lucide-react';

import { Button } from '@ui/button.ui';

import { cn } from '@css/utils';

export function TiptapToolbar({
    editor,
}: {
    editor: Editor | null;
}): ReactElement | null {
    if (!editor) return null;

    const items = [
        {
            icon: Bold,
            isActive: editor.isActive('bold'),
            action: () => editor.chain().focus().toggleBold().run(),
            label: 'Bold',
        },
        {
            icon: Italic,
            isActive: editor.isActive('italic'),
            action: () => editor.chain().focus().toggleItalic().run(),
            label: 'Italic',
        },
        {
            icon: List,
            isActive: editor.isActive('bulletList'),
            action: () => editor.chain().focus().toggleBulletList().run(),
            label: 'Bullet list',
        },
        {
            icon: ListOrdered,
            isActive: editor.isActive('orderedList'),
            action: () => editor.chain().focus().toggleOrderedList().run(),
            label: 'Ordered list',
        },
        {
            icon: Link,
            isActive: editor.isActive('link'),
            action: () => {
                if (editor.isActive('link')) {
                    editor.chain().focus().unsetLink().run();
                    return;
                }
                const url = window.prompt('URL');
                if (url) {
                    editor
                        .chain()
                        .focus()
                        .setLink({ href: url, target: '_blank' })
                        .run();
                }
            },
            label: 'Link',
        },
    ];

    return (
        <div className="border-border/40 flex items-center gap-0.5 border-b px-2 py-1">
            {items.map(({ icon: Icon, isActive, action, label }) => (
                <Button
                    key={label}
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={action}
                    aria-label={label}
                    className={cn(
                        'h-7 w-7 p-0',
                        isActive && 'bg-accent text-accent-foreground',
                    )}
                >
                    <Icon className="size-3.5" />
                </Button>
            ))}
        </div>
    );
}
