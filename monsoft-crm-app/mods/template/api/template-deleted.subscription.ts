import { protectedEndpoint, subscribe } from '@api/providers/server';

import { z } from 'zod';

import { ensurePermission } from '@guard/providers';

import { userMatcherEnum } from '../enums';

// subscription to notify when a template is deleted
export const onTemplateDeleted = protectedEndpoint
    .input(
        z.object({
            creator: userMatcherEnum,
        }),
    )
    .subscription(
        subscribe(
            'templateDeleted',
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

                // return the deleted template
                return template;
            },
        ),
    );
