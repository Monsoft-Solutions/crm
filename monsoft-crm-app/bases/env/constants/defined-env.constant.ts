import { definedEnvSchema } from '../schemas/defined-env.schema';

const rawDefinedEnv = process.env.DEFINED;

export const definedEnv = definedEnvSchema.parse(
    typeof rawDefinedEnv === 'string'
        ? JSON.parse(rawDefinedEnv)
        : rawDefinedEnv,
);
