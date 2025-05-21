import { protectedEndpoint, subscribe } from '@api/providers/server';

import { z } from 'zod';

import { ensurePermission } from '@guard/providers';

import { userMatcherEnum } from '../enums';

// subscription to notify when a template status is updated
export const onTemplateStatusUpdated = protectedEndpoint
    .input(
        z.object({
            creator: userMatcherEnum,
        }),
    )
    .subscription(
        subscribe(
            'templateStatusUpdated',
            ({
                ctx: {
                    session: { user },
                },

                input: { creator },

                data: template,
            }) => {
                // if searching for templates from anyone
                // ensure user has permission to read everyone's templates
                if (creator === 'anyone')
                    ensurePermission({
                        user,
                        resource: 'template',
                        action: 'read',
                    });

                // return the updated template
                return template;
            },
        ),
    );
