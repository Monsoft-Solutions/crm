import type { z } from 'zod';

import { on } from 'events';

import { emitter } from './emitter.provider';

import { events } from '../constants';

import { Events } from '@events/types';

// -------------------------------------------------------------------------

// listen to a type-safe event
export async function listen<E extends keyof Events>(
    event: E,
    callback: (data: z.infer<Events[E]>) => void | Promise<void>,
    options?: Parameters<typeof on>[2],
): Promise<void> {
    // get the event schema
    const eventSchema = events[event];

    // listen to the event
    for await (const [rawData] of on(emitter, event, options)) {
        // parse the raw data
        const parsingEventData = eventSchema.safeParse(rawData);

        // if the data is not valid, log an error and continue
        if (!parsingEventData.success) {
            console.log(
                `${event} listener received bad data: ${JSON.stringify(
                    rawData,
                )}`,
            );

            // continue to the next event
            continue;
        }

        const { data: parsedEventData } = parsingEventData;

        // otherwise, call the callback function with the parsed data
        await callback(parsedEventData);
    }
}
