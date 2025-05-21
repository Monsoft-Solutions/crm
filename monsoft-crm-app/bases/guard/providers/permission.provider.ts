import type { User, Resource } from '../types';

import * as permissions from '@app/res';

import { unauthorizedError } from '@api/errors';

// type describing all resource permissions
type Permissions = typeof permissions;

// type describing all actions that can be performed on a given resource
type Action<R> = R extends Resource<infer _, infer Action> ? Action : never;

// type describing the structure of the data associated with a given resource
type Data<R> = R extends Resource<infer Data, string> ? Data : never;

// only function you'll ever need to use for setting up guards on resources
// checks if the given user has permission to perform the given action on the given resource
// if `action` is not provided, it checks whether permission is granted for any action on any resource instance of that category
// otherwise, if `data` is not provided, it checks whether permission is granted for that action on any resource instance of that category
// otherwise, it checks whether permission is granted for that action on that specific resource instance for that specific user
export function hasPermission<R extends keyof Permissions>({
    user,
    resource,
    action,
    instance,
}: {
    user: User;
    resource: R;
    action?: Action<Permissions[R]>;
    instance?: Data<Permissions[R]>;
}): boolean {
    // TODO: this gives permission to perform all actions on all instances of all resources for all users. REMOVE!!!
    return true;

    // check if the given user has any role that grants permission for the given action on the given resource
    return user.roles.some((role) => {
        // get the permission guard for the given resource and role
        const permission = permissions[resource][role];

        // if no resource+role permission guard is found,
        // the role does not grant permission for the given resource
        // (still, the user may be granted permission through another role)
        if (permission === undefined) return false;

        // if the resource+role permission guard is a boolean,
        // it directly indicates whether the role grants permission
        // otherwise, permission is granted depending on the action
        if (typeof permission === 'boolean') return permission;

        // if the resource+role permission guard is not boolean, and no action is provided,
        // permission is not granted
        // effectively checking whether the role grants permission for any action on any resource instance of that category
        if (action === undefined) return false;

        // at this point, the permission guard depends on the action and can be
        // - a boolean (undefined is treated as false)
        // - a function taking the user and resource attributes and returning a boolean
        const actionPermission = permission[
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
            action as keyof typeof permission
        ] as
            | undefined
            | boolean
            | ((arg: {
                  user: User;
                  instance: Data<Permissions[R]>;
              }) => boolean);

        // if no permission guard is found
        // the role does not grant permission for the given action on the given resource
        if (actionPermission === undefined) return false;

        // if the permission guard is a boolean, it directly indicates whether the role grants permission
        // otherwise, the permission guard is a function
        // that depends on the given user and resource attributes
        if (typeof actionPermission === 'boolean') return actionPermission;

        // if permission guard is a function, and no data is provided, permission is not granted
        // effectively checking whether the role grants permission for the given action on any resource instance of that category
        if (instance === undefined) return false;

        // otherwise, the permission guard function is evaluated for the given user and data
        // and permission is granted based on the its return
        return actionPermission({ user, instance });
    });
}

// handy guard for protecting endpoints
// if the user does not have the required permission,
// interrupts execution by throwing unauthorized error
// otherwise allows the request to continue
export function ensurePermission<R extends keyof Permissions>({
    user,
    resource,
    action,
    instance,
}: {
    user: User;
    resource: R;
    action?: Action<Permissions[R]>;
    instance?: Data<Permissions[R]>;
}): void {
    // check if the user has permission to perform the given action on the given resource
    if (!hasPermission({ user, resource, action, instance })) {
        // if not, throw unauthorized error
        throw unauthorizedError;
    }
}
