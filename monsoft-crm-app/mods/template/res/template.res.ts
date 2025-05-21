import type { Resource } from '@guard/types';

type Data = {
    id: string;

    // id of the user who created the template
    creator: string;
};

// actions that can be performed on a template resource
type Action =
    | 'create'
    | 'read'
    | 'update_status'
    | 'delete'
    | 'toggle_random_template_service';

// template resource access control matrix
// top level keys are roles
// second level keys are actions
export const template: Resource<Data, Action> = {
    template_creator: {
        create: true,
        read: ({ user, instance }) => user.id === instance.creator,
        delete: ({ user, instance }) => user.id === instance.creator,
    },

    template_reviewer: {
        read: true,
        update_status: true,
    },

    template_cleaner: {
        read: true,
        delete: true,
    },

    template_service_admin: {
        toggle_random_template_service: true,
    },
};
