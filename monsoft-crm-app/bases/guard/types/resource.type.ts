import type { Role, User } from '.';

// type of a resource access contol matrix
// keys (top level) are roles, values are their permissions
export type Resource<Data, Action extends string> = Partial<
    Record<Role, RolePermission<Data, Action>>
>;

// type of a role permissions to a given resource, can be:
// - boolean -> access is independent of the action (undefined is treated as false)
// - Record<Action, ActionPermission> -> access depends on the action
type RolePermission<Data, Action extends string> =
    | boolean
    | Partial<Record<Action, ActionPermission<Data>>>;

// the value of the `roles` property on the `user` object
// shall not be directly used by guard functions
// since this information is already encoded
// in the structure of the access control matrix itself
// taken into account by using the guard function
// associated with the role being checked
const omit = 'roles' satisfies keyof User;

// type of a role permissions to perform a specific action on a given resource, can be:
// - boolean: access is independent of the particular user of resource instances
// - function returning boolean: access depends on user and resource attributes
type ActionPermission<Data> =
    | boolean
    | ((arg: { user: Omit<User, typeof omit>; instance: Data }) => boolean);
