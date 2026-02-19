import type { ReactElement } from 'react';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';

import { cn } from '@css/utils';

import { TiptapToolbar } from './tiptap-toolbar.component';

export function TiptapEditor({
    content,
    onUpdate,
    placeholder,
    className,
}: {
    content: string;
    onUpdate: (html: string) => void;
    placeholder?: string;
    className?: string;
}): ReactElement {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    target: '_blank',
                    rel: 'noopener noreferrer',
                },
            }),
            Placeholder.configure({
                placeholder: placeholder ?? 'Write your email...',
            }),
        ],
        content,
        onUpdate: ({ editor: e }) => {
            onUpdate(e.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[120px] px-3 py-2 text-sm',
            },
        },
    });

    return (
        <div
            className={cn(
                'border-border bg-background overflow-hidden rounded-lg border',
                className,
            )}
        >
            <TiptapToolbar editor={editor} />

            <EditorContent editor={editor} />
        </div>
    );
}
