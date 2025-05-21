import { z } from 'zod';

// user matcher enum
export const userMatcherEnum = z.enum(['anyone', 'me']);

// user matcher type
export type UserMatcher = z.infer<typeof userMatcherEnum>;
