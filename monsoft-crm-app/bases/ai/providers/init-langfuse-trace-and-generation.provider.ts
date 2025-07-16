import { v4 as uuidv4 } from 'uuid';

import { Message } from 'ai';

import {
    Langfuse,
    LangfuseGenerationClient,
    LangfuseTraceClient,
} from 'langfuse';

import { Function } from '@errors/types';
import { Error, Success } from '@errors/utils';

import { getCoreConf } from '@conf/providers/server';

import { aiModelToProvider } from '@ai/utils/ai-model-to-provider.util';
import { AiModel } from '@ai/enums';

export const initLangfuseTraceAndGeneration = (async ({
    prompt,
    messages,
    modelName,
    callerName,
    toolsNames,
}) => {
    const { data: coreConf, error: coreConfError } = await getCoreConf();

    if (coreConfError) return Error('FAIL_TO_GET_CORE_CONF');

    const { langfuseSecretKey, langfusePublicKey, langfuseBaseUrl } = coreConf;

    const langfuse = new Langfuse({
        baseUrl: langfuseBaseUrl,
        secretKey: langfuseSecretKey,
        publicKey: langfusePublicKey,
    });

    const modelProvider = aiModelToProvider(modelName);

    const traceId = uuidv4();

    const trace = langfuse.trace({
        name: callerName,
        id: traceId,
        metadata: {
            prompt,
            messages,
        },
        tags: [modelName, modelProvider, callerName],
    });

    const generation = trace.generation({
        model: modelName,
        input: messages && messages.length > 0 ? messages : prompt,
        metadata: {
            activeTools: toolsNames,
        },
    });

    return Success({ langfuse, trace, generation });
}) satisfies Function<
    {
        modelName: AiModel;
        callerName: string;
        toolsNames: string[];
    } & (
        | {
              prompt: string;
              messages?: undefined;
          }
        | {
              prompt?: undefined;
              messages: Message[];
          }
    ),
    {
        langfuse: Langfuse;
        trace: LangfuseTraceClient;
        generation: LangfuseGenerationClient;
    }
>;
