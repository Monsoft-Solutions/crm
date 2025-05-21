import { Function } from '@errors/types';

import { Error, Success } from '@errors/utils';

import { catchError } from '@errors/utils/catch-error.util';

// Helper function to convert stream to string
export const streamToString = (async (stream: NodeJS.ReadableStream) => {
    const promise = new Promise<string>((resolve, reject) => {
        const chunks: string[] = [];

        stream.on('data', (data: unknown) => {
            if (typeof data === 'object' && data !== null) {
                // eslint-disable-next-line @typescript-eslint/no-base-to-string
                chunks.push(data.toString());
            }
        });

        stream.on('end', () => {
            const joined = chunks.join('');

            const buffer = Buffer.from(joined);

            const content = buffer.toString();

            resolve(content);
        });

        stream.on('error', reject);
    });

    const { data, error } = await catchError(promise);

    if (error) return Error();

    return Success(data);
}) satisfies Function<NodeJS.ReadableStream, string>;
