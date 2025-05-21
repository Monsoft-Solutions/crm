import { seed } from 'drizzle-seed';

// type of a drizzle-seed refinement generator
export type SeedsGenerator = Parameters<
    Parameters<ReturnType<typeof seed>['refine']>[0]
>[0];
