import { z } from 'zod';

import { tool } from 'ai';

export const thinkTool = tool({
    parameters: z.object({
        thought: z.string().describe('The thought to think about'),
    }),

    description:
        'Use the tool to think about something. It will not obtain new information or change the database, but just append the thought to the log. Use it when complex reasoning or some cache memory is needed.',

    // eslint-disable-next-line @typescript-eslint/require-await
    execute: async ({ thought }) => {
        console.log(thought);
        return thought;
    },
});
