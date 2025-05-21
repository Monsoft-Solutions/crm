import { rolesUntyped } from '../constants';

export type Role = (typeof rolesUntyped)[number];
