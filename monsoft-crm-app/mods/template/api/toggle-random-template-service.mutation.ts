import { Success } from '@errors/utils';

import { protectedEndpoint } from '@api/providers/server';

import { z } from 'zod';

import { ensurePermission } from '@guard/providers';

import { setCustomConf } from '@conf/providers/server';
import { queryMutationCallback } from '@api/providers/server/query-mutation-callback.provider';

// mutation to toggle the random template service
export const toggleRandomTemplateService = protectedEndpoint
    .input(z.object({ active: z.boolean() }))
    .mutation(
        queryMutationCallback(
            async ({
                ctx: {
                    session: { user },
                },
                input: { active },
            }) => {
                // ensure user has permission to toggle the random template service
                ensurePermission({
                    user,
                    resource: 'template',
                    action: 'toggle_random_template_service',
                });

                // toggle the random template service active flag
                // on the custom configuration
                await setCustomConf({
                    organizationId: user.organizationId,
                    conf: { randomTemplateServiceActive: active },
                });

                return Success();
            },
        ),
    );
