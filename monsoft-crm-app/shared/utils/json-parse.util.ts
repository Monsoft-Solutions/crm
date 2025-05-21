import { Function } from '@errors/types';
import { Error, Success } from '@errors/utils';

export const jsonParse = ((json: string) => {
    try {
        return Success(JSON.parse(json) as unknown);
    } catch {
        return Error('INVALID_JSON');
    }
}) satisfies Function<string, unknown>;
