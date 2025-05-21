import { File } from '@shared/schemas';

import { Media } from './media.ui';

export function Thumbnail({ file }: { file: File }) {
    return <Media file={file} className="size-10 rounded-sm" />;
}
