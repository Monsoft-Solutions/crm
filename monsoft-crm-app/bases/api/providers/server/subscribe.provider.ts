import type { z } from 'zod';

import { emitter } from '@events/providers/emitter.provider';
// Use Node.js events directly without destructuring
import events from 'events';

import * as appEvents from '@app/events';

type Events = typeof appEvents;

// Utility to create a tRPC subscription listening to an event
export function subscribe<Context, Input, E extends keyof Events, Output>(
    event: E,
    callback: (args: {
        data: z.infer<Events[E]>;
        ctx: Context;
        input: Input;
    }) => Output | undefined,
): ({
    signal,
    ctx,
    input,
}: {
    signal?: AbortSignal;
    ctx: Context;
    input: Input;
}) => AsyncGenerator<Output> {
    return async function* ({
        signal,
        ctx,
        input,
    }: {
        signal?: AbortSignal;
        ctx: Context;
        input: Input;
    }): AsyncGenerator<Output> {
        for await (const [rawData] of events.on(emitter, event, { signal })) {
            const { data } = appEvents[event].safeParse(rawData);

            if (!data) {
                console.log(
                    `${event} subscriber received bad data: ${JSON.stringify(
                        rawData,
                    )}`,
                );
                continue;
            }

            const output = callback({ data, ctx, input });

            if (output) yield output;
        }
    };
}
