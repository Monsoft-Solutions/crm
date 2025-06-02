// provider used to emit type-safe events
import { Error, Success } from '@errors/utils';

import type { z } from 'zod';

import { emitter } from './emitter.provider';

import { Events } from '@events/types';
import { SyncReturn } from '@errors/types';
import { events } from '../constants';

// -------------------------------------------------------------------------

// emit a type-safe event with a payload
export const emit = <E extends keyof Events>({
    event,
    payload,
}: {
    event: E;
    payload: z.infer<Events[E]>;
}): SyncReturn => {
    const eventSchema = events[event];

    const parsingEventData = eventSchema.safeParse(payload);

    if (!parsingEventData.success) return Error('INVALID_PAYLOAD');

    const { data: parsedEventData } = parsingEventData;

    emitter.emit(event, parsedEventData);

    return Success();
};
