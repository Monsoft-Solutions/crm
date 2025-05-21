import { Error, Success } from '@errors/utils';

import { jsonParse } from '@shared/utils/json-parse.util';
import { wait } from '@shared/utils/wait.util';

import { protectedEndpoint } from '@api/providers/server';

import { queryMutationCallback } from '@api/providers/server/query-mutation-callback.provider';

import { bpiProviderUrl } from '@mods/template/constants';
import { bpiProviderOutputSchema } from '@mods/template/schemas';

// query to get the current bpi
export const getBpi = protectedEndpoint.mutation(
    queryMutationCallback(async () => {
        // simulate latency
        await wait(1000);

        // fetch the bpi from the provider url
        const response = await fetch(bpiProviderUrl).catch(() => undefined);

        if (!response) return Error('CONNECTION_ERROR');

        // get the response body
        const responseText = await response.text().catch(() => undefined);

        if (!responseText) return Error('RESPONSE_FORMAT_ERROR');

        const jsonParseResult = jsonParse(responseText);

        const { error: jsonParseError } = jsonParseResult;

        if (jsonParseError) return Error('INVALID_RESPONSE');

        // parse the response body
        const parsingBody = bpiProviderOutputSchema.safeParse(
            jsonParseResult.data,
        );

        if (!parsingBody.success) return Error('INVALID_RESPONSE');

        // get the bpi string
        const bpi = parsingBody.data.EUR.last;

        // round to the nearest integer
        const roundedBpi = Math.round(bpi);

        return Success(roundedBpi);
    }),
);
